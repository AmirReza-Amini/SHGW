const {requiresAuth} = require('../app-setting')
const { SendResponse } = require('../util/utility')

module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!requiresAuth) return next();

  //console.log('from admin middleware ' , req.user);
  if (req.user.userType !=="Admin") return  SendResponse(req, res, 'دسترسی مقدور نمیباشد..', false,403)

  next();
};
