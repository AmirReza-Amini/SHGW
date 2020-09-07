const {requiresAuth} = require('../app-setting')
const { SendResponse } = require('../util/utility')

module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!requiresAuth) return next();

  if (req.user.userType !=="Admin") return  SendResponse(req, res, { error: 'دسترسی مقدور نمیباشد..' }, false,403)

  next();
};
