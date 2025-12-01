import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../lib/firebaseClient';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

// Define types
interface SiteConfig {
  whatsapp: string;
  logoUrl: string;
  logoUploadedBy?: string;
  logoUploadedAt?: any;
  logoHistory?: Array<{
    url: string;
    uploadedBy: string;
    uploadedAt: any;
  }>;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface NewProduct {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

interface LogoHistoryEntry {
  url: string;
  uploadedBy: string;
  uploadedAt: any;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<SiteConfig>({ 
    whatsapp: '', 
    logoUrl: '', 
    logoUploadedBy: '', 
    logoUploadedAt: null,
    logoHistory: []
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({ name: '', price: '', description: '', imageUrl: '' });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser(user);
        loadConfig();
        loadProducts();
      } else {
        navigate('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadConfig = async () => {
    try {
      // Check if config exists
      const configSnapshot = await getDocs(collection(db, 'site', 'config'));
      if (!configSnapshot.empty) {
        const configData = configSnapshot.docs[0].data();
        setConfig({
          whatsapp: configData.whatsapp || '',
          logoUrl: configData.logoUrl || '',
          logoUploadedBy: configData.logoUploadedBy || '',
          logoUploadedAt: configData.logoUploadedAt || null,
          logoHistory: configData.logoHistory || []
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsData: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  const handleConfigUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update config in Firestore
      const configRef = doc(db, 'site', 'config');
      await setDoc(configRef, {
        whatsapp: config.whatsapp
      }, { merge: true });

      alert('Configuration updated successfully!');
    } catch (error: any) {
      console.error('Error updating config:', error);
      alert('Failed to update configuration.');
    }
  };

  const handleLogoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!logoFile) {
      setUploadError('Please select a logo file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      // Validate file type
      const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(logoFile.type)) {
        throw new Error('Invalid file type. Please upload SVG, PNG, JPG, JPEG, or WebP files only.');
      }

      // Validate file size (2MB max)
      if (logoFile.size > 2 * 1024 * 1024) {
        throw new Error('File size exceeds 2MB limit.');
      }

      // Upload file to Firebase Storage
      const fileName = `site/logo/${Date.now()}_${logoFile.name}`;
      const logoRef = ref(storage, fileName);
      await uploadBytes(logoRef, logoFile);
      const logoUrl = await getDownloadURL(logoRef);

      // Get current config
      const currentConfig = config;

      // Create new history entry
      const newHistoryEntry: LogoHistoryEntry = {
        url: currentConfig.logoUrl,
        uploadedBy: currentConfig.logoUploadedBy || '',
        uploadedAt: currentConfig.logoUploadedAt
      };

      // Update logo history (keep only last 3)
      let logoHistory = currentConfig.logoHistory || [];
      if (newHistoryEntry.url) {
        logoHistory.unshift(newHistoryEntry);
      }
      logoHistory = logoHistory.slice(0, 3);

      // Update config in Firestore
      const configRef = doc(db, 'site', 'config');
      await setDoc(configRef, {
        ...currentConfig,
        logoUrl: logoUrl,
        logoUploadedBy: user?.email || '',
        logoUploadedAt: new Date(),
        logoHistory: logoHistory
      }, { merge: true });

      await loadConfig(); // Reload config to get updated data
      setLogoFile(null);
      alert('Logo uploaded successfully! Changes will appear on the site shortly.');
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload logo.');
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!window.confirm('Are you sure you want to remove the current logo and revert to default?')) return;
    
    try {
      // Get current config
      const currentConfig = config;

      // Create new history entry for current logo
      const newHistoryEntry: LogoHistoryEntry = {
        url: currentConfig.logoUrl,
        uploadedBy: currentConfig.logoUploadedBy || '',
        uploadedAt: currentConfig.logoUploadedAt
      };

      // Update logo history (keep only last 3)
      let logoHistory = currentConfig.logoHistory || [];
      if (newHistoryEntry.url) {
        logoHistory.unshift(newHistoryEntry);
      }
      logoHistory = logoHistory.slice(0, 3);

      // Update config in Firestore
      const configRef = doc(db, 'site', 'config');
      await setDoc(configRef, {
        ...currentConfig,
        logoUrl: '',
        logoUploadedBy: '',
        logoUploadedAt: null,
        logoHistory: logoHistory
      }, { merge: true });

      await loadConfig(); // Reload config to get updated data
      alert('Logo removed successfully! Site is now using the default logo.');
    } catch (error: any) {
      console.error('Error removing logo:', error);
      alert('Failed to remove logo.');
    }
  };

  const handleRevertToPreviousLogo = async (historyEntry: LogoHistoryEntry) => {
    if (!window.confirm('Are you sure you want to revert to this previous logo?')) return;
    
    try {
      // Get current config
      const currentConfig = config;

      // Create new history entry for current logo
      const newHistoryEntry: LogoHistoryEntry = {
        url: currentConfig.logoUrl,
        uploadedBy: currentConfig.logoUploadedBy || '',
        uploadedAt: currentConfig.logoUploadedAt
      };

      // Update logo history (keep only last 3)
      let logoHistory = currentConfig.logoHistory || [];
      if (newHistoryEntry.url) {
        logoHistory.unshift(newHistoryEntry);
      }
      logoHistory = logoHistory.slice(0, 3);

      // Update config in Firestore
      const configRef = doc(db, 'site', 'config');
      await setDoc(configRef, {
        ...currentConfig,
        logoUrl: historyEntry.url,
        logoUploadedBy: historyEntry.uploadedBy,
        logoUploadedAt: historyEntry.uploadedAt,
        logoHistory: logoHistory.filter((entry) => entry.url !== historyEntry.url)
      }, { merge: true });

      await loadConfig(); // Reload config to get updated data
      alert('Logo reverted successfully!');
    } catch (error: any) {
      console.error('Error reverting to previous logo:', error);
      alert('Failed to revert to previous logo.');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = newProduct.imageUrl;
      if (productImageFile) {
        const imageRef = ref(storage, `products/${newProduct.name}-${Date.now()}`);
        await uploadBytes(imageRef, productImageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add product to Firestore
      const productRef = collection(db, 'products');
      await setDoc(doc(productRef), {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        imageUrl: imageUrl
      });

      // Reset form and reload products
      setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
      setProductImageFile(null);
      loadProducts();
      alert('Product added successfully!');
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  const handleUpdateProduct = async (productId: string, updatedData: any) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updatedData);
      loadProducts();
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', productId));
      loadProducts();
      alert('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload SVG, PNG, JPG, JPEG, or WebP files only.');
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('File size exceeds 2MB limit.');
        return;
      }

      setLogoFile(file);
      setUploadError('');
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImageFile(e.target.files[0]);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070d] via-[#0a0c18] to-[#05070d] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9B234] mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070d] via-[#0a0c18] to-[#05070d] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0F111A]/70 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="font-display text-2xl">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#9CA5C2]">Admin</span>
            <button
              onClick={handleLogout}
              className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Site Logo & Branding */}
        <section className="mb-12">
          <h2 className="font-display text-xl mb-6">Site Logo & Branding</h2>
          
          <div className="glass rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(4,6,16,0.55)]">
            <form onSubmit={handleLogoUpload} className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Current Logo</label>
                <div className="flex items-center gap-4">
                  {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Current logo" className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">No logo</span>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/svg+xml,image/png,image/jpeg,image/webp"
                      onChange={handleLogoChange}
                      className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                    />
                    <p className="mt-1 text-xs text-[#9CA5C2]">Upload a new logo (SVG, PNG, JPG, WebP - max 2MB)</p>
                  </div>
                </div>
                
                {logoFile && (
                  <div className="mt-4">
                    <label className="block text-sm mb-2">Preview</label>
                    <img 
                      src={URL.createObjectURL(logoFile)} 
                      alt="Logo preview" 
                      className="w-32 h-32 object-contain border border-white/10 rounded-lg p-2"
                    />
                  </div>
                )}
                
                {uploadError && (
                  <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">
                    {uploadError}
                  </div>
                )}
                
                {config.logoUrl && (
                  <div className="mt-4 text-sm text-[#9CA5C2]">
                    <p>Uploaded by: {config.logoUploadedBy || 'Unknown'}</p>
                    <p>Uploaded on: {formatDate(config.logoUploadedAt)}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading || !logoFile}
                  className="rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </button>
                
                {config.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="rounded-full border border-red-500/50 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-red-300 transition hover:bg-red-500/10"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Logo History */}
        {config.logoHistory && config.logoHistory.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-xl mb-6">Logo History</h2>
            
            <div className="glass rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(4,6,16,0.55)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.logoHistory.map((entry, index) => (
                  <div key={index} className="glass rounded-2xl border border-white/10 bg-white/5 p-4">
                    <img 
                      src={entry.url} 
                      alt={`Previous logo ${index + 1}`} 
                      className="w-full h-24 object-contain mb-3"
                    />
                    <div className="text-xs text-[#9CA5C2]">
                      <p>Uploaded by: {entry.uploadedBy || 'Unknown'}</p>
                      <p>Uploaded on: {formatDate(entry.uploadedAt)}</p>
                    </div>
                    <button
                      onClick={() => handleRevertToPreviousLogo(entry)}
                      className="mt-3 w-full rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/30"
                    >
                      Revert to this
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Site Configuration */}
        <section className="mb-12">
          <h2 className="font-display text-xl mb-6">Site Configuration</h2>
          
          <div className="glass rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(4,6,16,0.55)]">
            <form onSubmit={handleConfigUpdate} className="space-y-6">
              <div>
                <label className="block text-sm mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={config.whatsapp}
                  onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                  className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                  placeholder="918217469646"
                />
                <p className="mt-1 text-xs text-[#9CA5C2]">Used for order buttons on the public site</p>
              </div>

              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_25px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1"
              >
                Update Configuration
              </button>
            </form>
          </div>
        </section>

        {/* Products Management */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl">Products Management</h2>
            
            <button
              onClick={() => {
                const modal = document.getElementById('add-product-modal') as HTMLDialogElement | null;
                if (modal) {
                  modal.showModal();
                }
              }}
              className="rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1"
            >
              Add Product
            </button>
          </div>

          {/* Add Product Modal */}
          <dialog id="add-product-modal" className="glass rounded-[30px] border border-white/10 bg-white/5 p-6 w-full max-w-2xl shadow-[0_25px_60px_rgba(4,6,16,0.55)] backdrop:bg-black/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg">Add New Product</h3>
              <button
                onClick={() => {
                  const modal = document.getElementById('add-product-modal') as HTMLDialogElement | null;
                  if (modal) {
                    modal.close();
                  }
                }}
                className="text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                  placeholder="Product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                  placeholder="Product description"
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageChange}
                  className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    const modal = document.getElementById('add-product-modal') as HTMLDialogElement | null;
                    if (modal) {
                      modal.close();
                    }
                  }}
                  className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-2 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1"
                >
                  Add Product
                </button>
              </div>
            </form>
          </dialog>

          {/* Products List */}
          <div className="glass rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(4,6,16,0.55)]">
            {products.length === 0 ? (
              <p className="text-center py-8 text-[#9CA5C2]">No products found. Add your first product!</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="glass rounded-2xl border border-white/10 bg-white/5 p-4">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                    )}
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="text-sm text-[#9CA5C2] mt-1">{product.description}</p>
                    
                    {editingProduct === product.id ? (
                      <div className="mt-3">
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => {
                            const updatedProducts = products.map(p => 
                              p.id === product.id ? { ...p, price: parseFloat(e.target.value) } : p
                            );
                            setProducts(updatedProducts);
                          }}
                          className="glass w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-[#F9B234]/50"
                          min="0"
                          step="0.01"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateProduct(product.id, { price: product.price })}
                            className="flex-1 rounded-lg bg-green-500/20 px-3 py-1 text-xs text-green-300 hover:bg-green-500/30"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="flex-1 rounded-lg bg-gray-500/20 px-3 py-1 text-xs text-gray-300 hover:bg-gray-500/30"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-semibold text-[#F9B234]">₹{product.price}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(product.id)}
                            className="rounded-lg bg-blue-500/20 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/30"
                          >
                            Edit Price
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-lg bg-red-500/20 px-3 py-1 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;