// Mock Firebase functions for testing
const mockFirestore = {
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn()
};

const mockStorage = {
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn()
};

// Mock the Firebase client
jest.mock('../lib/firebaseClient', () => ({
  db: mockFirestore,
  storage: mockStorage
}));

// Import the functions to test
const { uploadLogo, removeLogo, revertToPreviousLogo } = require('./firebaseUtils');

describe('Firebase Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadLogo', () => {
    it('should validate file type and size', async () => {
      const mockFile = {
        type: 'image/gif', // Invalid type
        size: 1000000
      };

      await expect(uploadLogo(mockFile, 'test@example.com'))
        .rejects
        .toThrow('Invalid file type. Please upload SVG, PNG, JPG, JPEG, or WebP files only.');
      
      const mockLargeFile = {
        type: 'image/png',
        size: 3 * 1024 * 1024 // 3MB - too large
      };

      await expect(uploadLogo(mockLargeFile, 'test@example.com'))
        .rejects
        .toThrow('File size exceeds 2MB limit.');
    });

    it('should upload valid files successfully', async () => {
      const mockFile = {
        type: 'image/png',
        size: 1000000,
        name: 'test-logo.png'
      };

      // Mock Firebase functions
      mockFirestore.doc.mockReturnValue('mock-doc-ref');
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          logoUrl: 'old-logo-url',
          logoUploadedBy: 'previous@example.com',
          logoUploadedAt: new Date(),
          logoHistory: []
        })
      });
      
      mockStorage.ref.mockReturnValue('mock-storage-ref');
      mockStorage.uploadBytes.mockResolvedValue();
      mockStorage.getDownloadURL.mockResolvedValue('new-logo-url');
      mockFirestore.setDoc.mockResolvedValue();

      const result = await uploadLogo(mockFile, 'test@example.com');
      
      expect(result).toBe('new-logo-url');
      expect(mockStorage.uploadBytes).toHaveBeenCalled();
      expect(mockFirestore.setDoc).toHaveBeenCalled();
    });
  });

  describe('removeLogo', () => {
    it('should remove the current logo and update history', async () => {
      // Mock Firebase functions
      mockFirestore.doc.mockReturnValue('mock-doc-ref');
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          logoUrl: 'current-logo-url',
          logoUploadedBy: 'test@example.com',
          logoUploadedAt: new Date(),
          logoHistory: []
        })
      });
      mockFirestore.setDoc.mockResolvedValue();

      await removeLogo();
      
      expect(mockFirestore.setDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        expect.objectContaining({
          logoUrl: '',
          logoUploadedBy: '',
          logoUploadedAt: null
        }),
        { merge: true }
      );
    });
  });

  describe('revertToPreviousLogo', () => {
    it('should revert to a previous logo from history', async () => {
      const historyEntry = {
        url: 'previous-logo-url',
        uploadedBy: 'previous@example.com',
        uploadedAt: new Date()
      };

      // Mock Firebase functions
      mockFirestore.doc.mockReturnValue('mock-doc-ref');
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          logoUrl: 'current-logo-url',
          logoUploadedBy: 'test@example.com',
          logoUploadedAt: new Date(),
          logoHistory: []
        })
      });
      mockFirestore.setDoc.mockResolvedValue();

      await revertToPreviousLogo(historyEntry);
      
      expect(mockFirestore.setDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        expect.objectContaining({
          logoUrl: 'previous-logo-url',
          logoUploadedBy: 'previous@example.com'
        }),
        { merge: true }
      );
    });
  });
});