const speakeasy = require('speakeasy');

const generateOtp = async (secretLength = 20) => {
  const secret = speakeasy.generateSecret({ length: secretLength });

  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });

  return otp;
};

module.exports = generateOtp;
