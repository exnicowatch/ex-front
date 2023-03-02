interface Session{
  client_info: {
    player_id: string
    remote_ip?: string
    tracking_info?: string
  }
  content_auth: {
    content_auth_info?: {
      method: string
      name: string
      value: string
    }
    max_content_count?: number
    auth_type: string
    content_key_timeout: number
    service_id: string
    service_user_id: string
  }
  content_id: string
  content_src_id_sets: {
    allow_subset?: string
    content_src_ids: {
      src_id_to_mux: {
        audio_src_ids: string[]
        video_src_ids: string[]
      }
    }[]
  }[]
  content_type: string
  content_uri: string
  keep_method: {
    heartbeat: {
      lifetime: number
      deletion_timeout_on_no_stream?: number
      onetime_token?: string
    }
  }
  priority: number
  protocol: {
    name: string
    parameters: {
      http_parameters: {
        method?: string
        parameters: {
          http_output_download_parameters?: {
            transfer_preset: string
            use_ssl: string
            use_well_known_port: string
            file_extension?: string
          }
          hls_parameters?: {
            segment_duration: number
            transfer_preset: string
            use_ssl: string
            use_well_known_port: string
            media_segment_format?: string
            separate_audio_stream?: string
            total_duration?: number
            encryption?: unknown
          }
        }
      }
    }
  }
  recipe_id: string
  session_operation_auth: {
    session_operation_auth_by_signature: {
      signature: string
      token: string
      created_time?: number
      expire_time?: number
    }
  }
  timing_constraint: string
  content_route?: number
  content_status?: string
  created_time?: number
  id?: string
  modified_time?: number
  play_control_range?: {
    max_play_speed: number
    min_play_speed: number
  }
  play_seek_time?: number
  play_speed?: number
  version?: string
  runtime_info?: {
    execution_history: unknown[]
    node_id: string
    thumbnailer_state: unknown[]
  }
}

interface SessionAPIResponse{
  meta: {
    status: number,
    message: string
  },
  data?: {
    session: Session
  }
}
