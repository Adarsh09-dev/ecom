const generateOtp = () => {
  return Math.floor(Math.random() * 900000) + 100000; // 1000000 to 900000
};

export default generateOtp;
