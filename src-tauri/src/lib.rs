use serde::{Deserialize, Serialize};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Serialize, Deserialize)]
struct TranslateRequest {
    model: String,
    messages: Vec<Message>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
}

#[tauri::command]
async fn translate_text(model: String, messages: Vec<Message>) -> Result<String, String> {
    let api_key = std::env::var("NVIDIA_API_KEY")
        .unwrap_or_else(|_| "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".to_string());

    let client = reqwest::Client::new();
    let request_body = TranslateRequest { model, messages };

    println!("Sending request to NVIDIA API...");

    let response = client
        .post("https://integrate.api.nvidia.com/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let status = response.status();
    println!("Response status: {}", status);

    let response_text = response.text().await.map_err(|e| format!("Failed to read response: {}", e))?;
    println!("Response body: {}", response_text);

    if !status.is_success() {
        return Err(format!("API error ({}): {}", status, response_text));
    }

    Ok(response_text)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, translate_text])
        .run(tauri::generate_context!())
        .expect("error while running BablerEdit");
}
