const validate = (schema, type = 'body') => {
    return async (req, res, next) => {
      try {
        console.log(req.body)
        let dataToValidate = type === 'params' ? req.params : type === 'query' ? req.query : req.body;
        await schema.validateAsync(dataToValidate);
        next();
      } catch (error) {
        req.flash("error_msg", `Erro de validação: ${error.message}`);
        const referer = req.get("referer") || "/"; 
        res.redirect(referer);
      }
    };
};
module.exports = validate;  