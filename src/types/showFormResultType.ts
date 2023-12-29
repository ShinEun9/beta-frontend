export interface ShowFormResultType {
  show_type: string;
  show_sub_type: string | null;
  title: string;
  univ: string;
  department: string;
  location: string;
  location_detail: string | null;
  main_image_color: string;
  start_date: string;
  end_date: string;
  position: string; //
  tags: string;
  content: string | null;
  is_reservation: string;
  method: string | null;
  google_form_url: string | null;
  price: string | null;
  head_count: string | null;
  date_time: string | null;
  notice: string | null;
}
