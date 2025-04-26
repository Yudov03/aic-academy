import { useLoaderData, useFetcher, Link, useSearchParams, useNavigate, useNavigation } from '@remix-run/react';
import { LoaderFunction, json } from '@remix-run/node';
import { CourseService } from '~/services/courses.service';
import { Course } from '~/models/courses.model';
import {
  Base,
  Box,
  Text,
  Input,
  Button,
  Divider,
  Skeleton,
  Art,
} from '@aic-kits/react';
import { useState, useEffect } from 'react';
import { Checkbox, Dropdown } from '~/components';
// Định nghĩa các tùy chọn sắp xếp: label cho người dùng và value cho API/URL
const sortOptions = [
  { label: 'Release Date (newest first)', value: 'date_desc' },
  { label: 'Release Date (oldest first)', value: 'date_asc' },
  { label: 'Course Title (a-z)', value: 'title_asc' },
  { label: 'Course Title (z-a)', value: 'title_desc' },
  // Thêm các tùy chọn khác nếu cần
];

// Định nghĩa kiểu dữ liệu trả về từ API category/tag (Giả định dựa trên WP REST API)
interface WPTerm {
  id: number;
  name: string;
  slug: string; 
  // Có thể có các trường khác như count, description, taxonomy...
}

export const loader: LoaderFunction = async ({ request }) => {
  const courseService = new CourseService();
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const page = parseInt(params.get('page') || '1', 10);
  const search = params.get('search') || '';
  const categoriesString = params.get('categories') || ''; // VD: "audio-gen,video-gen" hoặc ""
  const tagsString = params.get('tags') || '';           // VD: "released" hoặc ""
  const sortValue = params.get('sort') || sortOptions[0].value; 

  // ** Logic để chuyển đổi sortValue thành các tham số API cụ thể (ví dụ: orderby, order) **
  // Phần này phụ thuộc vào cách API của bạn xử lý việc sắp xếp
  let apiOrderBy = 'date'; // Mặc định
  let apiOrder = 'desc'; // Mặc định

  switch (sortValue) {
    case 'date_desc':
      apiOrderBy = 'date'; // Hoặc 'post_date' tùy API
      apiOrder = 'desc';
      break;
    case 'date_asc':
      apiOrderBy = 'date'; // Giả định rating lưu trong meta field
      apiOrder = 'asc';
      break;
    case 'title_desc':
      apiOrderBy = 'title'; // Giả định popularity lưu trong meta field
      apiOrder = 'desc';
      break;
    case 'title_asc':
      apiOrderBy = 'title'; // Giả định popularity lưu trong meta field
      apiOrder = 'asc';
      break;
    // Thêm các case khác nếu cần
  }
  // ** Kết thúc phần logic chuyển đổi **

  try {
    // --- Tạo đối tượng options cho API một cách có điều kiện ---
    const fetchOptions: {
      order: string;
      orderby: string;
      paged: number;
      search?: string;
      categories?: string; // Optional
      tags?: string;       // Optional
      // Thêm các trường khác nếu cần (ví dụ: meta_key)
    } = {
      order: apiOrder,
      orderby: apiOrderBy,
      paged: page,
    };

    // Chỉ thêm 'search' nếu nó có giá trị
    if (search) {
      fetchOptions.search = search;
    }
    // Chỉ thêm 'categories' nếu categoriesString không rỗng
    if (categoriesString) {
      fetchOptions.categories = categoriesString;
    }
    // Chỉ thêm 'tags' nếu tagsString không rỗng
    if (tagsString) {
      fetchOptions.tags = tagsString;
    }
    // --- Kết thúc tạo options ---

    // Gọi cả 3 API song song
    const [coursesResponse, categoriesResponse, tagsResponse] = await Promise.all([
      courseService.fetchAllCourses(fetchOptions), 
      fetch('https://ai-tutors.co/wp-json/wp/v2/course-category'), 
      fetch('https://ai-tutors.co/wp-json/wp/v2/course-tag')      
    ]);

    // Xử lý kết quả API Khóa học
    const courses = coursesResponse.data;
    const totalPages = coursesResponse.meta?.pages ?? 1;
    const totalCourses = coursesResponse.meta?.total ?? courses?.length ?? 0;

    // Xử lý kết quả API Categories
    let availableCategories: WPTerm[] = [];
    if (categoriesResponse.ok) {
      availableCategories = await categoriesResponse.json();
    } else {
      console.warn("Failed to fetch categories:", categoriesResponse.statusText);
      // Có thể muốn throw error hoặc trả về mảng rỗng
    }

    // Xử lý kết quả API Tags
    let availableTags: WPTerm[] = [];
    if (tagsResponse.ok) {
      availableTags = await tagsResponse.json();
    } else {
      console.warn("Failed to fetch tags:", tagsResponse.statusText);
       // Có thể muốn throw error hoặc trả về mảng rỗng
    }

    console.log(`Loader: Options sent: ${JSON.stringify(fetchOptions)}. Fetched ${courses?.length} courses. Total pages: ${totalPages}.`);

    // Trả về tất cả dữ liệu cần thiết
    return json({ 
      courses, 
      totalPages, 
      currentPage: page, 
      totalCourses,
      availableCategories, 
      availableTags,        
    });

  } catch (error) {
    console.error("Error fetching data in loader:", error);
    // Trả về cấu trúc dữ liệu mặc định ngay cả khi lỗi
    return json({ 
      courses: [], 
      totalPages: 0, 
      currentPage: 1, 
      totalCourses: 0, 
      availableCategories: [], // Trả về mảng rỗng khi lỗi
      availableTags: [],       // Trả về mảng rỗng khi lỗi
      error: "Failed to load page data" 
    }, { status: 500 });
  }
};

// --- Component CourseCardSkeleton ---
function CourseCardSkeleton() {
  return (
    <Box
      bgColor="white"
      borderColor="grey200" // Dùng màu nhạt hơn cho skeleton border
      b='thin'
      borderRadius='md'
      className="shadow-sm overflow-hidden flex flex-col h-full" // Giữ cấu trúc cơ bản
    >
      {/* Skeleton for Thumbnail */}
      <Skeleton variant="rectangle" width="100%" className="aspect-video" /> 

      <Box display='flex' flexDirection='column' p='md'> {/* Thêm flexGrow */}
        {/* Skeleton for Title (2 dòng) */}
        
        <Skeleton variant="rounded" width="80%" className='h-[5.25rem] line-clamp-3'/> 

        {/* Skeleton for Metadata */}
        <Box 
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          pt='sm'
          pb='sm'
          className='mb-4' // Thêm khoảng cách dưới metadata
        >
          <Skeleton variant="rounded" height={16} width="40%" />
          <Skeleton variant="rounded" height={16} width="30%" />
        </Box>

        {/* Skeleton for Author Info */}
        <Skeleton variant="rounded" height={16} width="70%" className='mb-4' /> 

        

        {/* Skeleton for Button (Thêm mt-auto để đẩy xuống dưới) */}
        <Button
              text="Loading Primary"
              color="primary"
              loading={true}
            />
        
      </Box>
    </Box>
  );
}
// --- End Component CourseCardSkeleton ---

export default function CoursesPage() {
  const initialData = useLoaderData<{ 
      courses: Course[]; 
      totalPages: number; 
      currentPage: number; 
      totalCourses?: number;
      availableCategories: WPTerm[];
      availableTags: WPTerm[];
      error?: string;
  }>();
  const fetcher = useFetcher<typeof initialData>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';

  const displayData = fetcher.data || initialData;
  const { courses, totalPages, currentPage, totalCourses, availableCategories, availableTags, error } = displayData;

  // State for search input
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // State for selected filters (initialize from URL params if needed on load)
  // Assume params are comma-separated IDs or slugs
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categories')?.split(',').filter(Boolean) || [] 
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  );

  // State for sorting (already exists, keep for later Dropdown integration)
  const [currentSortValue, setCurrentSortValue] = useState<string>(
    searchParams.get('sort') || sortOptions[0].value // Lấy từ URL hoặc mặc định là tùy chọn đầu tiên
  );

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // --- Handler for Sorting ---
  const handleSortChange = (newValue: string) => {
    setCurrentSortValue(newValue);
    setIsSortDropdownOpen(false); // Đóng dropdown sau khi chọn
  };

  // --- useEffect chính ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);

      // Update search, category, tag params (như trước)
      if (searchQuery) newParams.set('search', searchQuery); else newParams.delete('search');
      if (selectedCategories.length > 0) newParams.set('categories', selectedCategories.join(',')); else newParams.delete('categories');
      if (selectedTags.length > 0) newParams.set('tags', selectedTags.join(',')); else newParams.delete('tags');
      
      // --- Update sort param (dùng currentSortValue) ---
      if (currentSortValue !== sortOptions[0].value) { 
        newParams.set('sort', currentSortValue);
      } else {
        newParams.delete('sort'); 
      }

      // Always go to page 1 when filters change
      newParams.set('page', '1');

      // Check if params actually changed before navigating
      if (newParams.toString() !== searchParams.toString()) {
         navigate(`/courses?${newParams.toString()}`, { replace: true });
      }

    }, 500); // Debounce changes

    return () => clearTimeout(timer);
  // --- THÊM currentSortValue VÀO ĐÂY, XÓA sortingOption ---
  }, [searchQuery, selectedCategories, selectedTags, currentSortValue, navigate]); 

  if (error) {
      return <Base><Box p="lg"><Text color="danger">{error}</Text></Box></Base>;
  }

  const handleCategoryToggle = (categoryIdentifier: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryIdentifier)
        ? prev.filter((c) => c !== categoryIdentifier)
        : [...prev, categoryIdentifier]
    );
  };

  const handleTagToggle = (tagIdentifier: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagIdentifier)
        ? prev.filter((t) => t !== tagIdentifier)
        : [...prev, tagIdentifier]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
    navigate('/courses?page=1', { replace: true }); // Navigate to base state
  };

  // Helper để lấy label của lựa chọn sort hiện tại
  const getCurrentSortLabel = () => {
    return sortOptions.find(opt => opt.value === currentSortValue)?.label || sortOptions[0].label;
  };

  return (
    <Base>
      <Box
        p="md"
        bgColor="primary"
        r="sm"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap='lg'
      >
        <Art
          width="100px"
          height="100px"
          type="image"
          art="https://placehold.co/300x300"
        />
        <Box>
          <Text fontSize="4xl" fontWeight="bold">CHATGPT 4.0</Text>
          <Text textTransform='uppercase' fontSize="large" fontWeight="semibold" color="white">New ARRIVAL</Text>
        </Box>
      </Box>

      <Box className="flex flex-col md:flex-row gap-6 p-6">
        {/* filter component */}
        <Box className="w-full md:w-1/5 flex flex-col gap-6 mb-6 md:mb-0">
          {/* search component */}
          <Box>
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e)}
              leftIcon={<Box>🔍</Box>}
            />
          </Box>
          {/* categories component */}
          <Box>
            <Box mb="sm"><Text fontWeight="bold" >Categories</Text></Box>
            <Box display="flex" flexDirection="column" gap="sm"> {/* Thay thế className */}
              {availableCategories && availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <Checkbox
                    key={category.id}
                    label={<Text fontSize="medium">{category.name}</Text>}
                    checked={selectedCategories.includes(category.name)} 
                    onChange={() => handleCategoryToggle(category.name)}
                  />
                ))
              ) : (
                <Text fontSize="small" color="grey500">No categories available.</Text>
              )}
            </Box>
          </Box>
          {/* tags component */}
          <Box>
            <Box mb="sm"><Text fontWeight="bold" >Tags</Text></Box>
            <Box display="flex" flexDirection="column" gap="sm"> {/* Thay thế className */}
              {availableTags && availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <Checkbox 
                    key={tag.id} 
                    label={<Text fontSize="medium">{tag.name}</Text>} 
                    checked={selectedTags.includes(tag.name)} 
                    onChange={() => handleTagToggle(tag.name)}
                  />
                ))
              ) : ( 
                <Text fontSize="small" color="grey500">No tags available.</Text>
              )}
            </Box>
          </Box>
          {/* clear all filters button */}
          <Button text="Clear All Filters" color="danger" onClick={clearFilters} />
        </Box>
        {/* courses component */}
        <Box className="w-full md:w-4/5">
          {/* Sort component */}
          <Box display='flex' flexDirection='row' justifyContent='flex-end' mb='lg'>
            <Box p='sm'>
              <Text fontSize="medium" fontWeight="bold">Sort by</Text>
            </Box>
            <Dropdown
              value={currentSortValue}
              onValueChange={handleSortChange}
              items={sortOptions}
              trigger={
                <Text fontSize="small" color="grey700">{getCurrentSortLabel()}</Text>
              }
            />
          </Box>
          {/* courses list */}
          {loading ? (
            <Box className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {Array.from({ length: totalCourses || 0 }).map((_, index) => (
                <CourseCardSkeleton key={`skeleton-${index}`} />
              ))}
            </Box>
          ) : courses && courses.length > 0 ? (
            <Box className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {courses.map((course) => {
                let buttonText = 'Enroll Course';
                let buttonAction = () => alert(`Enrolling in: ${course.post_title}`);
                const enrollmentStatus = course.ping_status;

                if (enrollmentStatus === 'enrolled_started') {
                    buttonText = 'Continue Learning';
                    buttonAction = () => navigate(`/courses/${course.id}/learn`);
                } else if (enrollmentStatus === 'enrolled_not_started') {
                    buttonText = 'Start Learning';
                    buttonAction = () => navigate(`/courses/${course.id}/learn`);
                }
                return (
                  <Box
                    key={course.id}
                    bgColor="white"
                    borderColor="grey300"
                    b='thin'
                    borderRadius='md'
                    className="shadow-sm overflow-hidden flex flex-col h-full transition-all duration-200 ease-in-out hover:shadow-xl"
                  >
                    <Box className="relative w-full aspect-video">
                      <img
                        src={"https://placehold.co/400"}
                        alt={course.post_title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </Box>

                    <Box display='flex' flexDirection='column' p='md'>
                      <Text
                        fontSize='large'
                        fontWeight='semibold'
                        color='grey900'
                        className='h-[5.25rem] line-clamp-3'
                        title={course.post_title}
                      >
                        {course.post_title}
                      </Text>

                      <Box 
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        pt='sm'
                        pb='sm'
                      >
                        <Box className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <Text fontSize='medium' color='grey700'>{course.ratings?.rating_avg || 'N/A'}</Text>
                          <Text fontSize='medium' color='grey500'> ({course.ratings?.rating_count || '0'})</Text>
                        </Box>
                        <Box className="flex items-center gap-1">
                           <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                           <Text fontSize='medium' color='grey700'>{course.ratings?.rating_sum || '0'}</Text>
                        </Box>
                      </Box>
                      <Box mb='sm'>
                        <Text fontSize='medium' color='grey500' className='line-clamp-2'>
                          By <Link to={`/author/${course.post_author.user_url}`} className="font-medium text-gray-700">{course.post_author.display_name}</Link>
                          {course.course_category && course.course_category.length > 0 && (
                            <> in <Link to={`/categories/${course.course_category.map(cat => cat.term_id).join(', ')}`} className="font-medium text-gray-700" title={course.course_category.map(cat => cat.name).join(', ')}>{course.course_category.map(cat => cat.name).join(', ')}</Link></>
                          )}
                        </Text>
                      </Box>
                      
                      <Divider/>

                      <Box mt='md'>
                         <Button 
                           text={buttonText} 
                           onClick={buttonAction}
                           color="primary"
                         />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
             <Box className="text-center p-4">No courses found matching your criteria.</Box>
          )}

          {totalPages > 1 && (
            <Box className="flex justify-center items-center gap-2 mt-8">
              <Link
                to={`/courses?${updatePageParam(searchParams, currentPage - 1)}`}
                className={`px-4 py-2 border rounded ${currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-50'}`}
                aria-disabled={currentPage <= 1}
                onClick={(e) => { if (currentPage <= 1) e.preventDefault(); }}
              >
                Previous
              </Link>

              {renderPageNumbers(currentPage, totalPages, searchParams)}

              <Link
                to={`/courses?${updatePageParam(searchParams, currentPage + 1)}`}
                className={`px-4 py-2 border rounded ${currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-50'}`}
                aria-disabled={currentPage >= totalPages}
                 onClick={(e) => { if (currentPage >= totalPages) e.preventDefault(); }}
              >
                Next
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Base>
  );
}

function updatePageParam(currentParams: URLSearchParams, newPage: number): string {
  const newParams = new URLSearchParams(currentParams);
  newParams.set('page', String(newPage));
  return newParams.toString();
}

function renderPageNumbers(currentPage: number, totalPages: number, searchParams: URLSearchParams) {
  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
       startPage = Math.max(1, endPage - maxPagesToShow + 1);
   }

  if (startPage > 1) {
    pageNumbers.push(
      <Link key={1} to={`/courses?${updatePageParam(searchParams, 1)}`} className="px-4 py-2 border rounded bg-white text-blue-600 hover:bg-gray-50">1</Link>
    );
    if (startPage > 2) {
      pageNumbers.push(<span key="start-ellipsis" className="px-4 py-2">...</span>);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <Link
        key={i}
        to={`/courses?${updatePageParam(searchParams, i)}`}
        className={`px-4 py-2 border rounded ${i === currentPage ? 'bg-blue-600 text-white font-bold' : 'bg-white text-blue-600 hover:bg-gray-50'}`}
      >
        {i}
      </Link>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push(<span key="end-ellipsis" className="px-4 py-2">...</span>);
    }
    pageNumbers.push(
      <Link key={totalPages} to={`/courses?${updatePageParam(searchParams, totalPages)}`} className="px-4 py-2 border rounded bg-white text-blue-600 hover:bg-gray-50">{totalPages}</Link>
    );
  }

  return pageNumbers;
}