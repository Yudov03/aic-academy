import { WPTutorService, BaseResponse } from './wp-service';
import { Course } from '~/models/courses.model';

export class CourseService extends WPTutorService<Course> {
  constructor() {
    super('courses');
  }
  
  async fetchAllCourses(params: Record<string, string | number | undefined> = {}): Promise<BaseResponse<Course>> {
    const response = await this.get<{ 
      data: { 
        posts: Course[];
        total_course: number;
        total_page: number;
      };
    }>(params);

    const { posts, total_course, total_page } = response.data;

    return {
      data: posts,
      meta: {
        total: total_course,
        pages: total_page,
        current_page: Number(params.paged),
      },
    };
  }

  async fetchCourseById(courseId: number): Promise<Course> {
    return this.get<Course>({ id: courseId });
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    return this.post<Course>(data);
  }

  async updateCourse(courseId: number, data: Partial<Course>): Promise<Course> {
    return this.patch<Course>(courseId, data);
  }

  async deleteCourse(courseId: number): Promise<{ success: boolean; message: string }> {
    return this.delete(courseId);
  }
}