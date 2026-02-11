use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // Delayed resize to fix WebKit2GTK layout on X11.
            // The WebView needs time to initialize before the resize triggers a proper reflow.
            let win = window.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(200));
                if let Ok(size) = win.outer_size() {
                    let _ = win.set_size(tauri::Size::Physical(tauri::PhysicalSize {
                        width: size.width + 1,
                        height: size.height,
                    }));
                    std::thread::sleep(std::time::Duration::from_millis(50));
                    let _ = win.set_size(tauri::Size::Physical(size));
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running BablerEdit");
}
