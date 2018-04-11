module.exports.handleError = function handleError(error) {
  console.log(error);
  // return logger.logError(err).then(sendMailToAdminIfCritical).then(saveInOpsQueueIfCritical).then(determineIfOperationalError);
  // Returns if the process should exit
  return true;
};
