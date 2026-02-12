cask "bableredit" do
  version "0.2.1"
  sha256 "PLACEHOLDER_SHA256"

  url "https://github.com/Bit-Barron/BablerEdit/releases/download/v#{version}/BablerEdit_#{version}_universal.dmg"
  name "BablerEdit"
  desc "Translation editor for developers"
  homepage "https://github.com/Bit-Barron/BablerEdit"

  app "BablerEdit.app"

  zap trash: [
    "~/Library/Application Support/com.barron.bableredit",
    "~/Library/Caches/com.barron.bableredit",
    "~/Library/Preferences/com.barron.bableredit.plist",
  ]
end
