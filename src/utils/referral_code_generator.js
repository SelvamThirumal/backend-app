class ReferralUtil {
  static generateReferralCode(code = "") {
    const namePart = code.replace(/\s/g, "").substring(0, 4).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${namePart}${randomPart}`;
  }
}

export default ReferralUtil;
