#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use flate2::write::GzEncoder;
use flate2::Compression;
use std::fs::File;
use tar::Builder;

#[tauri::command]
fn compress(path: &str, name: &str) {
  let compressed_file = File::create(name).expect("Failed to create the archive file");
  let mut encoder = GzEncoder::new(compressed_file, Compression::default());
  {
    // Create tar archive and compress files
    let mut archive = Builder::new(&mut encoder);
    archive
      .append_dir_all("", path)
      .expect("Failed to append files to the archive");
  }
  // Finish Gzip file
  encoder.finish().expect("Failed to finish the compression");
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![compress])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
