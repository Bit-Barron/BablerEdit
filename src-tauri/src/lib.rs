#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Fix WebKitGTK rendering issues on Linux (especially X11).
    // DMABUF: prevents blank screen from DMA-BUF renderer failures.
    // COMPOSITING_MODE: prevents "Failed to create GBM buffer" errors by
    // disabling hardware-accelerated compositing (falls back to software).
    // See: https://github.com/tauri-apps/tauri/issues/13493
    #[cfg(target_os = "linux")]
    {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running BablerEdit");
}
