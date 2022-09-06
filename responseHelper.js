class ResponseHelpers {
  static handleSuccess(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = 'success';
  }

  static handleError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  static response(res) {
    if (this.type === 'success') {
      return res.status(this.statusCode).json({
        status: this.statusCode,
        message: this.message,
        data: this.data,
      });
    }
    return res.status(this.statusCode).json({
      status: this.statusCode,
      message: this.message,
    });
  }
}

module.exports = ResponseHelpers;
