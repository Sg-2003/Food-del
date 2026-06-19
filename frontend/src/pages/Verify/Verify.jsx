import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import './Verify.css'

const Verify = () => {

    const [searchParams] = useSearchParams()
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const { url, token } = useContext(StoreContext)
    const navigate = useNavigate()

    const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'failed'

    const retryPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/pay", { orderId }, { headers: { token } })
            if (response.data.success) {
                window.location.replace(response.data.session_url)
            } else {
                navigate('/myorders')
            }
        } catch (err) {
            console.error(err)
            navigate('/myorders')
        }
    }

    const verifyPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId })
            if (response.data.success) {
                setStatus('success')
                setTimeout(() => navigate('/myorders'), 3000)
            } else {
                setStatus('failed')
                setTimeout(retryPayment, 3000)
            }
        } catch (error) {
            console.error("Payment verification failed:", error)
            setStatus('failed')
            setTimeout(retryPayment, 3000)
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div className='verify'>
            {status === 'loading' && (
                <div className="verify-card">
                    <div className="spinner"></div>
                    <p className="verify-msg">Verifying your payment...</p>
                </div>
            )}
            {status === 'success' && (
                <div className="verify-card success-card">
                    <div className="checkmark-circle">
                        <svg viewBox="0 0 52 52" className="checkmark-svg">
                            <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
                        </svg>
                    </div>
                    <h2 className="verify-title">Payment Successful!</h2>
                    <p className="verify-msg">Your order has been placed successfully.</p>
                    <p className="verify-sub">Order ID: <span>#{orderId?.slice(-8).toUpperCase()}</span></p>
                    <p className="verify-redirect">Redirecting to orders in 3 seconds...</p>
                    <button className="verify-btn" onClick={() => navigate('/myorders')}>View Orders Now</button>
                </div>
            )}
            {status === 'failed' && (
                <div className="verify-card failed-card">
                    <div className="cross-circle">
                        <svg viewBox="0 0 52 52" className="cross-svg">
                            <circle className="cross-circle-bg" cx="26" cy="26" r="25" fill="none" />
                            <line className="cross-line" x1="16" y1="16" x2="36" y2="36" />
                            <line className="cross-line" x1="36" y1="16" x2="16" y2="36" />
                        </svg>
                    </div>
                    <h2 className="verify-title">Payment Pending</h2>
                    <p className="verify-msg">Your order has been created but payment is incomplete.</p>
                    <p className="verify-redirect">Redirecting to Stripe checkout to retry in 3 seconds...</p>
                    <button className="verify-btn failed-btn" onClick={retryPayment}>Retry Now</button>
                </div>
            )}
        </div>
    )
}

export default Verify