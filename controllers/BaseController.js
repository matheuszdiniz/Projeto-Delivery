class BaseController {
    handleError(req, res, message, redirectPath) {
      req.flash("error_msg", message);
      res.redirect(redirectPath);
    }
  }
  
module.exports = BaseController;  