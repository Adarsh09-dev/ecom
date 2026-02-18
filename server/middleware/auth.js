import jwt from 'jsonwebtoken'
const auth = (req, res, next) => {

    if(!token) {
        return res.redirect("/login");
    }
  try {
    // const token = req.cookies.accessToken || req?.header?.authorization.split(" ")[1]  /// [bearer, token]
    // if (!token) {
    //     return res.
    //     status(401).json({
    //         message : "Provide token"
    //     })     
    // }

    
    const decode =  jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

    // if (!decode) {
    //     return res.status(401).json({
    //         message : 'unauthorized access',
    //         error : true,
    //         success : false
    //     })  
     req.userId = decode.id;
     next(); 
    

  } catch  {
    return res.redirect("/login");
    // .status(500).json({
    //   message: error.message || error, 
    //   error: true,
    //   success: false,
    // })
  }
}

export default auth