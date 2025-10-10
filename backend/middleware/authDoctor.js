import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    // Try both cases since headers can be lowercase
    const token = req.headers.dToken || req.headers.dtoken
    
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.doctorId = token_decode.doctorId
        next()
    } catch (error) {
        console.log('JWT verification error:', error)
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor;