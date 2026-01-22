const setting = {
  title: "FNC Admin",
  baseurl: "http://localhost:3000",
  description: "This is the home page",
};
class SettingController {
  static async getSetting() {
    return setting;
  }

  static async updateSetting() {}
}

export default SettingController;
