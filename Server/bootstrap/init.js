module.exports = (req,res,next)=>{
    req.base = {
        result: true,
        data: {},
        token:''
    };
    next();
}