import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'

const MyOrders = () => {
    const { url, token } = useContext(StoreContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [trackOrder, setTrackOrder] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const [payingOrderId, setPayingOrderId] = useState(null)

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } })
            if (response.data.success) {
                setOrders(response.data.data.reverse())
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const refreshTracking = async () => {
        setRefreshing(true)
        try {
            const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } })
            if (response.data.success) {
                const updatedOrders = response.data.data.reverse()
                setOrders(updatedOrders)
                if (trackOrder) {
                    const updatedOrder = updatedOrders.find(o => o._id === trackOrder._id)
                    if (updatedOrder) {
                        setTrackOrder(updatedOrder)
                    }
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            // Add a small delay for a premium feel
            setTimeout(() => {
                setRefreshing(false)
            }, 600)
        }
    }

    const handlePay = async (orderId) => {
        setPayingOrderId(orderId)
        try {
            const response = await axios.post(url + '/api/order/pay', { orderId }, { headers: { token } })
            if (response.data.success) {
                window.location.replace(response.data.session_url)
            } else {
                alert(response.data.message || 'Payment initiation failed. Please try again.')
                setPayingOrderId(null)
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong. Please try again.')
            setPayingOrderId(null)
        }
    }

    useEffect(() => {
        if (token) fetchOrders()
    }, [token])

    const statusColor = (status) => {
        if (status === 'Delivered') return '#2e7d32'
        if (status === 'Out for Delivery') return '#e65100'
        return '#1565c0'
    }

    const statusDot = (status) => {
        if (status === 'Delivered') return '✓'
        if (status === 'Out for Delivery') return '🚚'
        return '🍳'
    }

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            {loading ? (
                <div className="orders-loading">
                    <div className="orders-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="orders-empty">
                    <img src={assets.parcel_icon} alt="" />
                    <p>No orders yet. Start ordering!</p>
                </div>
            ) : (
                <div className='my-orders-list'>
                    {orders.map((order, index) => (
                        <div key={index} className='my-orders-item'>
                            <div className="order-icon-wrap">
                                <img src={assets.parcel_icon} alt="parcel" className='parcel-icon' />
                            </div>
                            <div className="order-info">
                                <p className='order-food-list'>
                                    {order.items.map((item, i) =>
                                        i === order.items.length - 1
                                            ? `${item.name} × ${item.quantity}`
                                            : `${item.name} × ${item.quantity}, `
                                    )}
                                </p>
                                <div className="order-meta">
                                    <span className="order-amount">${order.amount}.00</span>
                                    <span className="order-count">· {order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                                    <span className="order-payment" style={{ color: order.payment ? '#2e7d32' : '#c62828' }}>
                                        · {order.payment ? '✓ Paid' : '✗ Unpaid'}
                                    </span>
                                </div>
                            </div>
                            <div className="order-status" style={{ color: statusColor(order.status), borderColor: statusColor(order.status) }}>
                                <span className="status-dot">{statusDot(order.status)}</span>
                                <span>{order.status}</span>
                            </div>
                            <div className="order-actions">
                                {!order.payment && (
                                    <button 
                                        className={`pay-btn ${payingOrderId === order._id ? 'disabled' : ''}`} 
                                        onClick={() => handlePay(order._id)}
                                        disabled={payingOrderId !== null}
                                    >
                                        {payingOrderId === order._id ? 'Processing...' : 'Pay Now'}
                                    </button>
                                )}
                                <button className='track-btn' onClick={() => setTrackOrder(order)}>Track Order</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tracking Modal */}
            {trackOrder && (
                <div className="track-modal-overlay" onClick={() => setTrackOrder(null)}>
                    <div className="track-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="track-modal-close" onClick={() => setTrackOrder(null)}>
                            <img src={assets.cross_icon} alt="Close" />
                        </button>
                        <div className="track-header">
                            <h3>Track Your Order</h3>
                            <p className="track-order-id">Order ID: {trackOrder._id}</p>
                            <p className="track-order-date">Placed on: {new Date(trackOrder.date).toLocaleDateString()} at {new Date(trackOrder.date).toLocaleTimeString()}</p>
                        </div>
                        
                        {/* Conditional Unpaid Payment View or Normal Timeline */}
                        {!trackOrder.payment ? (
                            <div className="unpaid-checkout-container">
                                <div className="card-animation-wrap">
                                    <div className="credit-card-graphic">
                                        <div className="card-chip"></div>
                                        <div className="card-logo">Stripe</div>
                                        <div className="card-number">•••• •••• •••• 4242</div>
                                        <div className="card-name">{trackOrder.address.firstName} {trackOrder.address.lastName}</div>
                                    </div>
                                </div>
                                <h4 className="unpaid-title">Complete Your Payment</h4>
                                <p className="unpaid-desc">
                                    Your order request is saved, but payment is pending. Please click below to securely pay with Stripe and send your order to the kitchen.
                                </p>
                                <button 
                                    className={`modal-pay-btn ${payingOrderId === trackOrder._id ? 'disabled' : ''}`} 
                                    onClick={() => handlePay(trackOrder._id)}
                                    disabled={payingOrderId !== null}
                                >
                                    {payingOrderId === trackOrder._id ? 'Redirecting to Stripe...' : '💳 Pay Now with Stripe'}
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Timeline Progress */}
                                {(() => {
                                    const stages = ['Food Processing', 'Out for Delivery', 'Delivered'];
                                    const currentIdx = stages.indexOf(trackOrder.status);
                                    let progressWidth = '0%';
                                    if (currentIdx === 0) progressWidth = '33%';
                                    else if (currentIdx === 1) progressWidth = '66%';
                                    else if (currentIdx === 2) progressWidth = '100%';
                                    
                                    return (
                                        <div className="track-timeline">
                                            <div className="track-timeline-bar" style={{ width: progressWidth }}></div>
                                            
                                            <div className="timeline-step completed">
                                                <div className="step-icon-wrap">📝</div>
                                                <div className="step-title">Confirmed</div>
                                                <div className="step-desc">Order placed & paid</div>
                                            </div>
                                            
                                            <div className={`timeline-step ${currentIdx >= 0 ? (currentIdx > 0 ? 'completed' : 'active') : 'pending'}`}>
                                                <div className="step-icon-wrap">🍳</div>
                                                <div className="step-title">Preparing</div>
                                                <div className="step-desc">Cooking in kitchen</div>
                                            </div>
                                            
                                            <div className={`timeline-step ${currentIdx >= 1 ? (currentIdx > 1 ? 'completed' : 'active') : 'pending'}`}>
                                                <div className="step-icon-wrap">🏍️</div>
                                                <div className="step-title">On The Way</div>
                                                <div className="step-desc">Out for delivery</div>
                                            </div>
                                            
                                            <div className={`timeline-step ${currentIdx >= 2 ? 'completed' : 'pending'}`}>
                                                <div className="step-icon-wrap">🎁</div>
                                                <div className="step-title">Delivered</div>
                                                <div className="step-desc">Arrived safely</div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Animation box based on status */}
                                <div className="track-animation-box">
                                    {trackOrder.status === 'Food Processing' && (
                                        <div className="cooking-container">
                                            <div className="cooking-pan">🍳</div>
                                            <div className="preparing-smoke">
                                                <span className="smoke-cloud"></span>
                                                <span className="smoke-cloud"></span>
                                                <span className="smoke-cloud"></span>
                                            </div>
                                            <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                                                Chef is preparing your delicious meal...
                                            </p>
                                        </div>
                                    )}
                                    
                                    {trackOrder.status === 'Out for Delivery' && (
                                        <div className="road-container">
                                            <div className="road-line"></div>
                                            <div className="animated-truck">🏍️</div>
                                            <p style={{ margin: '0 auto 8px auto', fontSize: '0.85rem', color: '#666', fontWeight: '500', textAlign: 'center', width: '100%', zIndex: 5 }}>
                                                Rider is speeding towards your doorstep!
                                            </p>
                                        </div>
                                    )}
                                    
                                    {trackOrder.status === 'Delivered' && (
                                        <div className="celebrate-container">
                                            <div className="celebrate-badge">🎉</div>
                                            <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#2e7d32', fontWeight: '600' }}>
                                                Order Delivered! Enjoy your meal!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Info Grid */}
                        <div className="track-info-grid">
                            <div className="info-section">
                                <h4>Delivery Address</h4>
                                <div className="address-details">
                                    <p><strong>{trackOrder.address.firstName} {trackOrder.address.lastName}</strong></p>
                                    <p>{trackOrder.address.street}</p>
                                    <p>{trackOrder.address.city}, {trackOrder.address.state} - {trackOrder.address.zipcode}</p>
                                    <p>{trackOrder.address.country}</p>
                                    <p style={{ marginTop: '8px', color: 'tomato', fontWeight: '500' }}>📞 {trackOrder.address.phone}</p>
                                </div>
                            </div>
                            
                            <div className="info-section">
                                <h4>Order Summary</h4>
                                <div className="track-items-list">
                                    {trackOrder.items.map((item, idx) => (
                                        <div key={idx} className="track-item-row">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>${item.price * item.quantity}.00</span>
                                        </div>
                                    ))}
                                    <div className="track-item-row" style={{ fontWeight: '700', borderTop: '1px solid #ddd', marginTop: '6px', paddingTop: '6px' }}>
                                        <span>Total Amount</span>
                                        <span>${trackOrder.amount}.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Refresh Button */}
                        {trackOrder.payment && (
                            <button 
                                className={`track-refresh-btn ${refreshing ? 'disabled' : ''}`} 
                                onClick={refreshTracking}
                                disabled={refreshing}
                            >
                                <span className={`refresh-icon ${refreshing ? 'spinning' : ''}`}>🔄</span>
                                {refreshing ? 'Refreshing Status...' : 'Refresh Status'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyOrders
