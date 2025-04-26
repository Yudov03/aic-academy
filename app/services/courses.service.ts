import { c } from 'node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P';
import { WPTutorService, BaseResponse } from './wp-service';
import { Course } from '~/models/courses.model';

export class CourseService extends WPTutorService<Course> {
  constructor() {
    // Endpoint "courses" được sử dụng để lấy danh sách khóa học
    super('courses');
  }

  /**
   * Lấy tất cả khóa học với các tham số lọc, tìm kiếm và sắp xếp.
   * @param params - Các tham số URL (lọc, tìm kiếm, sắp xếp).
   * @returns Danh sách các khóa học.
   */

  
  async fetchAllCourses(params: Record<string, string | number | undefined> = {}): Promise<BaseResponse<Course>> {
    // Gọi API và nhận phản hồi
    const response = await this.get<{ 
      data: { 
        posts: Course[];
        total_course: number;
        total_page: number;
      };
    }>(params);

    // Trích xuất và ánh xạ từ `data` trong response
    const { posts, total_course, total_page } = response.data;

    return {
      data: posts,
      meta: {
        total: total_course,
        pages: total_page,
        current_page: Number(params.paged), // Lấy từ tham số `paged`
      },
    };
  }



  /**
   * Lấy chi tiết khóa học theo ID.
   * @param courseId - ID của khóa học cần lấy.
   * @returns Thông tin chi tiết của khóa học.
   */
  async fetchCourseById(courseId: number): Promise<Course> {
    return this.get<Course>({ id: courseId });
  }

  /**
   * Tạo một khóa học mới.
   * @param data - Dữ liệu của khóa học mới.
   * @returns Thông tin khóa học vừa được tạo.
   */
  async createCourse(data: Partial<Course>): Promise<Course> {
    return this.post<Course>(data);
  }

  /**
   * Cập nhật thông tin khóa học.
   * @param courseId - ID của khóa học cần cập nhật.
   * @param data - Dữ liệu cập nhật của khóa học.
   * @returns Thông tin khóa học sau khi cập nhật.
   */
  async updateCourse(courseId: number, data: Partial<Course>): Promise<Course> {
    return this.patch<Course>(courseId, data);
  }

  /**
   * Xóa một khóa học.
   * @param courseId - ID của khóa học cần xóa.
   * @returns Kết quả xóa khóa học.
   */
  async deleteCourse(courseId: number): Promise<{ success: boolean; message: string }> {
    return this.delete(courseId);
  }
}