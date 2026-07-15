import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../utils/imageUtils';
import {
  API_URL,
  getKitEligibleProducts,
  getKitTemplates,
  generateKitFromTemplate,
  createCustomKit,
  getKitById,
  updateKit,
  addKitToCart
} from '../api';
import './KitBuilder.css';

// Kit builder components
import CategorySidebar from '../components/kitbuilder/CategorySidebar';
import ProductCard from '../components/kitbuilder/ProductCard';
import KitSummary from '../components/kitbuilder/KitSummary';
import TemplateSelector from '../components/kitbuilder/TemplateSelector';
import BuilderGuide from '../components/kitbuilder/BuilderGuide';

const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'knife', name: 'Knives' },
  { id: 'pan', name: 'Pans' },
  { id: 'pot', name: 'Pots' },
  { id: 'utensil', name: 'Utensils' },
  { id: 'bakeware', name: 'Bakeware' },
  { id: 'appliance', name: 'Appliances' },
  { id: 'storage', name: 'Storage' },
  { id: 'other', name: 'Other' },
];

const KitBuilderPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { addCustomKitToCart } = useCart();
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing kits

  // State for available products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // State for kit being built
  const [kitItems, setKitItems] = useState([]);
  const [kitName, setKitName] = useState('My Custom Kit');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // State for templates
  const [templates, setTemplates] = useState([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // State for first-time user guide
  const [showGuide, setShowGuide] = useState(true);

  // Calculate kit statistics
  const itemCount = kitItems.reduce((total, item) => total + item.quantity, 0);
  const basePrice = kitItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Apply volume discounts
  let discountPercentage = 0;
  if (itemCount >= 10) {
    discountPercentage = 10; // 10% off for 10+ items
  } else if (itemCount >= 5) {
    discountPercentage = 5; // 5% off for 5+ items
  }

  const totalPrice = basePrice * (1 - (discountPercentage / 100));

  // Calculate weight and deposit
  const totalWeight = kitItems.reduce((total, item) =>
    total + ((item.weight || 0) * item.quantity), 0);
  const totalDeposit = kitItems.reduce((total, item) =>
    total + ((item.depositAmount || 0) * item.quantity), 0);

  // Validate the kit composition
  const validateKit = () => {
    const errors = [];

    if (kitItems.length === 0) {
      errors.push('Your kit must contain at least one item');
      return errors;
    }

    // Check for essential categories
    const hasKnife = kitItems.some(item => item.category === 'knife');
    const hasCookware = kitItems.some(
      item => item.category === 'pan' || item.category === 'pot'
    );
    const hasUtensil = kitItems.some(item => item.category === 'utensil');

    if (!hasKnife) errors.push('Add at least one knife to your kit');
    if (!hasCookware) errors.push('Add at least one pan or pot to your kit');
    if (!hasUtensil) errors.push('Add at least one utensil to your kit');

    return errors;
  };

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const category = selectedCategory === 'all' ? '' : selectedCategory;
        console.log('Fetching kit products with:', { searchTerm, page, category });

        try {
          const data = await getKitEligibleProducts(searchTerm, page, category);
          console.log('Kit products response:', data);

          if (data && data.products && data.products.length > 0) {
            setProducts(data.products);
            setPage(data.page);
            setPages(data.pages);
          } else {
            console.warn('No products returned from API, using fallback data');
            useFallbackData();
          }
        } catch (apiError) {
          console.error('API error, using fallback data:', apiError);
          useFallbackData();
        }
      } catch (err) {
        console.error('Error fetching kit products:', err);
        setError(err.message || 'Failed to load products');
        toast.error('Failed to load products. Using fallback data.');
        useFallbackData();
      } finally {
        setLoading(false);
      }
    };

    // Fallback function to use when API fails
    const useFallbackData = () => {
      // Base URL for our image API endpoint
      // Mock products that match the structure expected by the component
      const mockProducts = [
        // Knives
        {
          _id: '1',
          name: "Chef's Knife",
          image: `${API_URL}/images/direct/knife-collection`,
          price: 12.99,
          individualRentalPrice: 8.99,
          kitCategory: "knife",
          isEssential: true
        },
        {
          _id: '2a',
          name: "Santoku Knife",
          image: `${API_URL}/images/direct/knife-collection`,
          price: 11.99,
          individualRentalPrice: 7.99,
          kitCategory: "knife",
          isEssential: false
        },
        {
          _id: '2b',
          name: "Bread Knife",
          image: `${API_URL}/images/direct/knife-collection`,
          price: 9.99,
          individualRentalPrice: 6.99,
          kitCategory: "knife",
          isEssential: false
        },
        {
          _id: '2c',
          name: "Paring Knife",
          image: `${API_URL}/images/direct/knife-collection`,
          price: 8.99,
          individualRentalPrice: 5.99,
          kitCategory: "knife",
          isEssential: false
        },

        // Pans
        {
          _id: '2',
          name: "Non-Stick Frying Pan",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 14.99,
          individualRentalPrice: 9.99,
          kitCategory: "pan",
          isEssential: true
        },
        {
          _id: '3a',
          name: "Cast Iron Skillet",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 16.99,
          individualRentalPrice: 11.99,
          kitCategory: "pan",
          isEssential: false
        },
        {
          _id: '3b',
          name: "Wok",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 15.99,
          individualRentalPrice: 10.99,
          kitCategory: "pan",
          isEssential: false
        },

        // Pots
        {
          _id: '3',
          name: "Stainless Steel Saucepan",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 15.99,
          individualRentalPrice: 10.99,
          kitCategory: "pot",
          isEssential: true
        },
        {
          _id: '4a',
          name: "Large Stock Pot",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 18.99,
          individualRentalPrice: 12.99,
          kitCategory: "pot",
          isEssential: false
        },
        {
          _id: '4b',
          name: "Dutch Oven",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 19.99,
          individualRentalPrice: 13.99,
          kitCategory: "pot",
          isEssential: false
        },

        // Utensils
        {
          _id: '4',
          name: "Silicone Cooking Utensil Set",
          image: `${API_URL}/images/direct/utensils`,
          price: 12.99,
          individualRentalPrice: 8.99,
          kitCategory: "utensil",
          isEssential: true
        },
        {
          _id: '5a',
          name: "Whisk",
          image: `${API_URL}/images/direct/utensils`,
          price: 6.99,
          individualRentalPrice: 4.99,
          kitCategory: "utensil",
          isEssential: false
        },
        {
          _id: '5b',
          name: "Measuring Cups and Spoons",
          image: `${API_URL}/images/direct/utensils`,
          price: 8.99,
          individualRentalPrice: 5.99,
          kitCategory: "utensil",
          isEssential: false
        },
        {
          _id: '5c',
          name: "Kitchen Tongs",
          image: `${API_URL}/images/direct/utensils`,
          price: 7.99,
          individualRentalPrice: 4.99,
          kitCategory: "utensil",
          isEssential: false
        },

        // Bakeware
        {
          _id: '6a',
          name: "Baking Sheet Set",
          image: `${API_URL}/images/direct/baking-collection`,
          price: 14.99,
          individualRentalPrice: 9.99,
          kitCategory: "bakeware",
          isEssential: false
        },
        {
          _id: '6b',
          name: "Muffin Tin",
          image: `${API_URL}/images/direct/baking-collection`,
          price: 10.99,
          individualRentalPrice: 7.99,
          kitCategory: "bakeware",
          isEssential: false
        },
        {
          _id: '6c',
          name: "Loaf Pan",
          image: `${API_URL}/images/direct/baking-collection`,
          price: 9.99,
          individualRentalPrice: 6.99,
          kitCategory: "bakeware",
          isEssential: false
        },

        // Appliances
        {
          _id: '7a',
          name: "Hand Mixer",
          image: `${API_URL}/images/direct/chefs-kit`,
          price: 21.99,
          individualRentalPrice: 15.99,
          kitCategory: "appliance",
          isEssential: false
        },
        {
          _id: '7b',
          name: "Food Processor",
          image: `${API_URL}/images/direct/chefs-kit`,
          price: 24.99,
          individualRentalPrice: 18.99,
          kitCategory: "appliance",
          isEssential: false
        },

        // Storage
        {
          _id: '8a',
          name: "Glass Food Storage Set",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 16.99,
          individualRentalPrice: 11.99,
          kitCategory: "storage",
          isEssential: false
        },
        {
          _id: '8b',
          name: "Mixing Bowls with Lids",
          image: `${API_URL}/images/direct/basic-cookware`,
          price: 14.99,
          individualRentalPrice: 9.99,
          kitCategory: "storage",
          isEssential: false
        }
      ];

      // Filter products based on selected category
      let filteredProducts = selectedCategory !== 'all'
        ? mockProducts.filter(p => p.kitCategory === selectedCategory)
        : mockProducts;

      // Also apply search term filter if provided
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(
          p => p.name.toLowerCase().includes(term) ||
               p.kitCategory.toLowerCase().includes(term)
        );
      }

      // Calculate the total pages (6 items per page)
      const itemsPerPage = 6;
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

      // Get the current page's items
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      // Update state with the paginated products and page information
      setProducts(paginatedProducts);
      setPage(page);
      setPages(totalPages);
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, page]);

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getKitTemplates();
        setTemplates(data);
      } catch (err) {
        console.error('Error loading templates:', err);
      }
    };

    fetchTemplates();
  }, []);

  // Load existing kit for editing if id is provided
  useEffect(() => {
    const fetchKitDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const kit = await getKitById(id);
        setKitName(kit.name);
        setKitItems(kit.items.map(item => ({
          ...item,
          quantity: item.quantity || 1,
        })));
        setIsEditMode(true);
      } catch (err) {
        toast.error('Failed to load kit details');
        navigate('/build-kit');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchKitDetails();
    }
  }, [id, isAuthenticated, navigate]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please log in to build a custom kit');
      navigate('/login?redirect=/build-kit');
    }
  }, [isAuthenticated, navigate]);

  // Handle adding item to kit
  const handleAddItem = (product) => {
    const existingItemIndex = kitItems.findIndex(
      item => item.product.toString() === product._id.toString()
    );

    if (existingItemIndex !== -1) {
      // Update quantity if already in kit
      const updatedItems = [...kitItems];
      updatedItems[existingItemIndex].quantity += 1;
      setKitItems(updatedItems);
    } else {
      // Add new item to kit
      setKitItems([
        ...kitItems,
        {
          product: product._id,
          name: product.name,
          image: getProductImageUrl(product.slug || product.kitCategory),
          price: product.individualRentalPrice || product.price,
          category: product.kitCategory,
          quantity: 1,
          weight: product.itemWeight || 0,
          depositAmount: product.depositAmount || 0,
        },
      ]);
    }

    toast.success(`${product.name} added to your kit`);
  };

  // Handle removing item from kit
  const handleRemoveItem = (productId) => {
    setKitItems(kitItems.filter(item => item.product.toString() !== productId.toString()));
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;

    setKitItems(kitItems.map(item =>
      item.product.toString() === productId.toString()
        ? { ...item, quantity }
        : item
    ));
  };

  // Handle applying template
  const handleApplyTemplate = async (templateId) => {
    try {
      setLoading(true);
      const { kit } = await generateKitFromTemplate(templateId);

      // If we already have items, ask for confirmation before replacing
      if (kitItems.length > 0) {
        if (window.confirm('This will replace your current kit items. Continue?')) {
          setKitItems(kit.items);
          setKitName(kit.name);
        }
      } else {
        setKitItems(kit.items);
        setKitName(kit.name);
      }

      setShowTemplateSelector(false);
    } catch (err) {
      toast.error('Failed to apply template');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving the kit
  const handleSaveKit = async () => {
    const validationErrors = validateKit();

    if (validationErrors.length > 0) {
      toast.warning(validationErrors[0]);
      return;
    }

    try {
      setLoading(true);

      const kitData = {
        name: kitName,
        items: kitItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

      let result;

      if (isEditMode) {
        result = await updateKit(id, kitData);
        toast.success('Kit updated successfully');
      } else {
        result = await createCustomKit(kitData);
        toast.success('Kit saved successfully');
      }

      // Redirect to kit details or my kits page
      navigate('/my-kits');

    } catch (err) {
      toast.error(err.message || 'Failed to save kit');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding kit to cart
  const handleAddToCart = async () => {
    const validationErrors = validateKit();

    if (validationErrors.length > 0) {
      toast.warning(validationErrors[0]);
      return;
    }

    try {
      setLoading(true);

      // If not in edit mode or kit not saved yet, save first
      if (!isEditMode) {
        const kitData = {
          name: kitName,
          items: kitItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
          })),
        };

        const savedKit = await createCustomKit(kitData);
        const cartItem = await addKitToCart(savedKit.kit._id);

        // Use context to add to cart
        addCustomKitToCart(cartItem);

        // Navigate to cart
        navigate('/cart');
      } else {
        // Kit already exists, just add to cart
        const cartItem = await addKitToCart(id);
        addCustomKitToCart(cartItem);
        navigate('/cart');
      }

    } catch (err) {
      toast.error(err.message || 'Failed to add kit to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kit-builder-page">
      <div className="kit-builder-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; Kit Builder
          </div>
          <h1>Build Your Custom Kitchenware Kit</h1>
          <p className="subtitle">
            Select individual items to create your perfect rental package
          </p>
        </div>
      </div>

      <div className="container">
        {/* First-time user guide */}
        {showGuide && (
          <BuilderGuide onClose={() => setShowGuide(false)} />
        )}

        <div className="kit-builder-layout">
          {/* Category sidebar */}
          <div className="kit-builder-sidebar">
            <CategorySidebar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <div className="template-section">
              <h3>Quick Start</h3>
              <p>Choose a template to get started:</p>
              <button
                className="btn btn-outline"
                onClick={() => setShowTemplateSelector(true)}
              >
                Browse Templates
              </button>
            </div>

            {templates.length > 0 && showTemplateSelector && (
              <TemplateSelector
                templates={templates}
                onApplyTemplate={handleApplyTemplate}
                onClose={() => setShowTemplateSelector(false)}
              />
            )}
          </div>

          {/* Main builder area */}
          <div className="kit-builder-main">
            <div className="product-grid">
              {loading && <div className="loader"></div>}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {!loading && products.length === 0 && (
                <div className="no-products">
                  <p>No products found. Try another category or search term.</p>
                </div>
              )}

              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToKit={() => handleAddItem(product)}
                  isInKit={kitItems.some(item =>
                    item.product.toString() === product._id.toString()
                  )}
                />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                {[...Array(pages).keys()].map(x => (
                  <button
                    key={x + 1}
                    className={`page-btn ${x + 1 === page ? 'active' : ''}`}
                    onClick={() => setPage(x + 1)}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kit summary sidebar */}
          <div className="kit-summary-sidebar">
            <KitSummary
              kitName={kitName}
              onKitNameChange={setKitName}
              items={kitItems}
              onRemoveItem={handleRemoveItem}
              onQuantityChange={handleQuantityChange}
              itemCount={itemCount}
              basePrice={basePrice}
              discountPercentage={discountPercentage}
              totalPrice={totalPrice}
              totalWeight={totalWeight}
              totalDeposit={totalDeposit}
              onSave={handleSaveKit}
              onAddToCart={handleAddToCart}
              isEditMode={isEditMode}
              validationErrors={validateKit()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitBuilderPage;
