import { WordPressEntity } from '~/models/wp-entity.model';

export interface Course extends WordPressEntity {
  post_author: {
    id: number;
    user_login: string;
    user_nicename: string;
    user_email: string;
    user_url: string;
    user_registered: string;
    user_status: string;
    display_name: string;
  };
  post_date?: string;
  post_date_gmt?: string;
  post_content: string;
  post_title: string;
  post_excerpt?: string;
  post_status: string;
  comment_status?: string;
  ping_status?: string;
  post_password?: string;
  post_name?: string;
  to_ping?: string;
  pinged?: string;
  post_modified?: string;
  post_modified_gmt?: string;
  post_content_filtered?: string;
  post_parent?: number;
  guid?: string;
  menu_order?: number;
  post_type?: string;
  post_mime_type?: string;
  comment_count?: string;
  filter?: string;
  thumbnail_url?: string;
  additional_info?: {
    course_settings?: [{
        maximum_students: number;
    }];
    course_price_type?: [];
    course_duration?: [{
        hours?: number;
        minutes?: number;
        seconds: number;
    }];
    course_level?: [string];
    course_benefits?: [string];
    course_requirements?: [];
    course_target_audience?: [];
    course_material_includes?: [];
    video?: {
      source: string;
      source_video_id: string;
      poster: string;
      source_external_url: string;
      source_shortcode: string;
      source_youtube: string;
      source_vimeo: string;
      source_embeded: string;
    }[];
    disable_qa?: boolean;
  };
  course_category?: {
    term_id: number;
    name: string;
    slug: string;
    term_group: number;
    term_taxonomy_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    filter: string;
  }[];
  ratings?: {
    rating_count: string;
    rating_sum: string;
    rating_avg: string;
    count_by_value?: {
      [key: string]: number;
    };
  };
  course_tags?: [];
  price: string;
}