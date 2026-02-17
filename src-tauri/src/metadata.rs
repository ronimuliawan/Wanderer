use exif::{Exif, In, Tag, Value};
use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};
use time::OffsetDateTime;

#[derive(Debug, Default)]
pub struct Metadata {
    pub date_taken: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub camera_make: Option<String>,
    pub camera_model: Option<String>,
}

pub fn extract_metadata(path: &Path) -> Metadata {
    let mut meta = Metadata::default();
    log::info!("Metadata: Extracting from {:?}", path);

    let file_meta = std::fs::metadata(path).ok();

    let exif = match File::open(path) {
        Ok(file) => {
            let mut reader = BufReader::new(file);
            match exif::Reader::new().read_from_container(&mut reader) {
                Ok(exif) => Some(exif),
                Err(e) => {
                    log::warn!("Metadata: EXIF read failed/empty: {}", e);
                    None
                }
            }
        }
        Err(e) => {
            log::error!("Metadata: Failed to open file: {}", e);
            None
        }
    };

    // Date Taken
    if let Some(exif) = exif.as_ref() {
        if let Some(field) = exif.get_field(Tag::DateTimeOriginal, In::PRIMARY) {
            meta.date_taken = Some(field.display_value().with_unit(exif).to_string());
        } else if let Some(field) = exif.get_field(Tag::DateTime, In::PRIMARY) {
            meta.date_taken = Some(field.display_value().with_unit(exif).to_string());
        }
    }

    // Fallback 1: filesystem modified timestamp (mtime)
    if meta.date_taken.is_none() {
        meta.date_taken = file_meta
            .as_ref()
            .and_then(|m| m.modified().ok())
            .and_then(format_system_time);
    }

    // Fallback 2: filesystem created/birth timestamp (ctime on Windows)
    if meta.date_taken.is_none() {
        meta.date_taken = file_meta
            .as_ref()
            .and_then(|m| m.created().ok())
            .and_then(format_system_time);
    }

    // GPS
    if let Some(exif) = exif.as_ref() {
        meta.latitude = get_coordinate(exif, Tag::GPSLatitude, Tag::GPSLatitudeRef);
        meta.longitude = get_coordinate(exif, Tag::GPSLongitude, Tag::GPSLongitudeRef);
    }

    log::info!(
        "Metadata: Result for {:?} -> Date: {:?}, Lat: {:?}, Lng: {:?}",
        path,
        meta.date_taken,
        meta.latitude,
        meta.longitude
    );

    // Camera Info
    if let Some(exif) = exif.as_ref() {
        if let Some(field) = exif.get_field(Tag::Make, In::PRIMARY) {
            meta.camera_make = Some(
                field
                    .display_value()
                    .with_unit(exif)
                    .to_string()
                    .replace("\"", ""),
            );
        }
        if let Some(field) = exif.get_field(Tag::Model, In::PRIMARY) {
            meta.camera_model = Some(
                field
                    .display_value()
                    .with_unit(exif)
                    .to_string()
                    .replace("\"", ""),
            );
        }
    }

    meta
}

fn format_system_time(system_time: SystemTime) -> Option<String> {
    let unix = system_time.duration_since(UNIX_EPOCH).ok()?.as_secs() as i64;
    let dt = OffsetDateTime::from_unix_timestamp(unix).ok()?;
    Some(format!(
        "{:04}-{:02}-{:02} {:02}:{:02}:{:02}",
        dt.year(),
        u8::from(dt.month()),
        dt.day(),
        dt.hour(),
        dt.minute(),
        dt.second()
    ))
}

fn get_coordinate(exif: &Exif, coord_tag: Tag, ref_tag: Tag) -> Option<f64> {
    let coord_field = exif.get_field(coord_tag, In::PRIMARY)?;
    let ref_field = exif.get_field(ref_tag, In::PRIMARY)?;

    let coord_val = match coord_field.value {
        Value::Rational(ref v) if v.len() >= 3 => {
            let degrees = v[0].to_f64();
            let minutes = v[1].to_f64();
            let seconds = v[2].to_f64();
            degrees + minutes / 60.0 + seconds / 3600.0
        }
        _ => return None,
    };

    let ref_str = ref_field.display_value().to_string();
    // latitude ref: N or S, longitude ref: E or W
    match ref_str.as_str() {
        "S" | "W" => Some(-coord_val),
        _ => Some(coord_val),
    }
}
