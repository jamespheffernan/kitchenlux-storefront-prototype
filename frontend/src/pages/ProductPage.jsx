import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductBySlug, fetchProductDetails, createProductReview } from '../api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getProductImageUrl, createImageErrorHandler } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import './ProductPage.css';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { userInfo, isAuthenticated } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // First try to fetch by slug
        let productData;
        try {
          productData = await fetchProductBySlug(slug);
        } catch (error) {
          // If slug fails, check if it's an ID
          if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            productData = await fetchProductDetails(slug);
          } else {
            throw error;
          }
        }

        setProduct(productData);

        // Load related products if there are any
        if (productData.related_products && productData.related_products.length > 0) {
          const relatedData = await Promise.all(
            productData.related_products.map(id => fetchProductDetails(id))
          );
          setRelatedProducts(relatedData);
        } else {
          // Mock related products if none defined
          setRelatedProducts([]);
        }

        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, quantity);

    // Optionally navigate to cart
    // navigate('/cart');
  };

  const handleQuantityChange = (newQty) => {
    if (newQty > 0 && newQty <= product.countInStock) {
      setQuantity(newQty);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('You must be logged in to submit a review');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setReviewSubmitting(true);
      await createProductReview(product._id, { rating, comment });
      toast.success('Review submitted successfully');

      // Refresh product data to show the new review
      const updatedProduct = await fetchProductDetails(product._id);
      setProduct(updatedProduct);

      // Reset form
      setRating(5);
      setComment('');
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-danger">Product not found</div>;
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/catalog">Collections</Link> &gt; {product.name}
        </div>

        <div className="product-details-layout">
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={getProductImageUrl(product.slug)}
                alt={product.name}
                onError={createImageErrorHandler(product.category?.toLowerCase() || 'kitchen')}
              />
            </div>
            {/* If we had multiple images, we'd show thumbnails here */}
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < product.rating ? 'star filled' : 'star'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="review-count">({product.numReviews} reviews)</span>
            </div>

            <div className="product-price">${product.price.toFixed(2)}/week</div>

            <p className="product-description">{product.description}</p>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className="meta-value">
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.countInStock}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-add-to-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <Link
                  to="/booking"
                  className="btn btn-book-now"
                  onClick={() => addToCart(product, quantity)}
                >
                  Book Now
                </Link>
              </div>
            )}

            {product.countInStock <= 0 && (
              <div className="out-of-stock-message">
                This product is currently out of stock. Please check back later.
              </div>
            )}
          </div>
        </div>

        <div className="product-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Details
            </button>
            <button
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          <div className="tabs-content">
            <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`}>
              <h3>What's Included:</h3>
              <ul className="items-included">
                {product.itemsIncluded && product.itemsIncluded.map((item, index) => (
                  <li key={index}>
                    <strong>{item.name}</strong>
                    {item.description && <span> - {item.description}</span>}
                  </li>
                ))}
              </ul>

              {product.perfect_for && product.perfect_for.length > 0 && (
                <>
                  <h3>Perfect For:</h3>
                  <ul className="perfect-for">
                    {product.perfect_for.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className={`tab-pane ${activeTab === 'specifications' ? 'active' : ''}`}>
              <table className="specs-table">
                <tbody>
                  {product.specifications && product.specifications.map((spec, index) => (
                    <tr key={index}>
                      <th>{spec.name}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`}>
              <h3>Customer Reviews</h3>

              {product.reviews && product.reviews.length === 0 && (
                <p>No reviews yet. Be the first to review this product!</p>
              )}

              <div className="reviews-list">
                {product.reviews && product.reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <div className="review-user">{review.name}</div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="review-comment">{review.comment}</div>
                  </div>
                ))}
              </div>

              {isAuthenticated ? (
                <div className="write-review">
                  <h4>Write a Review</h4>
                  <form onSubmit={submitReviewHandler}>
                    <div className="form-group">
                      <label htmlFor="rating">Rating</label>
                      <select
                        id="rating"
                        className="form-control"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="comment">Comment</label>
                      <textarea
                        id="comment"
                        className="form-control"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this product"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn"
                      disabled={reviewSubmitting}
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="review-login-prompt">
                  <p>Please <Link to="/login">sign in</Link> to write a review.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map((related) => (
                <div key={related._id} className="related-product">
                  <Link to={`/products/${related.slug}`}>
                    <div className="related-product-image">
                      <img
                        src={getProductImageUrl(related.slug)}
                        alt={related.name}
                        onError={createImageErrorHandler(related.category?.toLowerCase() || 'kitchen')}
                      />
                    </div>
                    <h3>{related.name}</h3>
                    <p className="related-product-price">${related.price.toFixed(2)}/week</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;