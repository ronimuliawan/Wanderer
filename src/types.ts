export interface MediaItem {
    id: number;
    file_path: string;
    thumbnail_path?: string;
    file_hash?: string;
    telegram_media_id?: string;
    mime_type?: string;
    width?: number;
    height?: number;
    duration?: number;
    size_bytes?: number;
    created_at: number; // Unix timestamp
    uploaded_at?: number; // Unix timestamp
    // New PRD fields
    date_taken?: string;      // EXIF date, then file mtime/ctime fallback
    latitude?: number;        // GPS coordinates
    longitude?: number;
    camera_make?: string;     // EXIF camera info
    camera_model?: string;
    is_favorite: boolean;     // Heart icon
    rating: number;           // 0-5 stars
    is_deleted: boolean;      // Soft delete (trash)
    deleted_at?: number;
    is_archived: boolean;
    archived_at?: number;
    is_cloud_only: boolean;  // Local file removed, exists only on Telegram
}

export interface Album {
    id: number;
    name: string;
    created_at: number;
    cover_path?: string;
}

export interface QueueItem {
    id: number;
    file_path: string;
    status: string; // 'pending', 'uploading', 'completed', 'failed'
    retries: number;
    error_msg?: string;
    added_at: number;
}

export interface Face {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
}

export interface QueueCounts {
    pending: number;
    uploading: number;
    failed: number;
}

export interface UploadEvent {
    id: number;
    filePath: string;
    status: 'uploading' | 'completed' | 'failed';
    error?: string;
}

export interface UploadProgressEvent {
    id: number;
    filePath: string;
    bytesUploaded: number;
    totalBytes: number;
    speedBps: number;
    etaSeconds: number;
    percent: number;
}

export interface RateLimitEvent {
    id: number;
    filePath: string;
    waitSeconds: number;
}

export interface SearchFilters {
    favorites_only?: boolean;
    min_rating?: number;
    date_from?: number;
    date_to?: number;
    camera_make?: string;
    has_location?: boolean;
}

export interface Tag {
    id: number;
    name: string;
    media_count: number;
}

export interface Person {
    id: number;
    name: string | null;
    created_at: number;
    face_count: number;
    cover_path: string | null;
}
