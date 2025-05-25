const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Prisma errors
    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry error'
      });
    }
  
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }
  
    // Default error
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  };
  
  const notFound = (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  };
  
export { errorHandler, notFound };