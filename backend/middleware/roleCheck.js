const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      const correctRole = role === 'employer' ? 'Employers' : 'Jobseekers';
      res.status(403).json({ message: `Access denied. ${correctRole} only.` });
    }
  };
};

module.exports = requireRole;
