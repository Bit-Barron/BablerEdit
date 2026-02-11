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
            // Force a resize cycle on startup to fix WebKit2GTK sizing on X11.
            // Without this, the WebView may not fill the window correctly on X11.
            let window = app.get_webview_window("main").unwrap();
            let size = window.outer_size()?;
            window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
                width: size.width + 1,
                height: size.height,
            }))?;
            window.set_size(tauri::Size::Physical(size))?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running BablerEdit");
}
