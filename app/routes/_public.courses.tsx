import { useLoaderData, useFetcher, Link, useSearchParams, useNavigate, useNavigation, type NavigateFunction } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
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
  Color,
} from '@aic-kits/react';
import { useState, useEffect } from 'react';
import { Checkbox, Dropdown } from '~/components';
import { getSession } from '~/utils/session.server';
import { prisma } from '~/utils/db.server';

const sortOptions = [
  { label: 'Release Date (newest first)', value: 'date_desc' },
  { label: 'Release Date (oldest first)', value: 'date_asc' },
  { label: 'Course Title (a-z)', value: 'title_asc' },
  { label: 'Course Title (z-a)', value: 'title_desc' },
];

interface WPTerm {
  id: number;
  name: string;
  slug: string; 
}

type UserEnrollmentSelection = {
  courseId: number;
  enrollment_status: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const courseService = new CourseService();
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const page = parseInt(params.get('page') || '1', 10);
  const search = params.get('search') || '';
  const categoriesString = params.get('categories') || '';
  const tagsString = params.get('tags') || '';         
  const sortValue = params.get('sort') || sortOptions[0].value; 

  let apiOrderBy = 'date';
  let apiOrder = 'desc';

  switch (sortValue) {
    case 'date_desc':
      apiOrderBy = 'date';
      apiOrder = 'desc';
      break;
    case 'date_asc':
      apiOrderBy = 'date';
      apiOrder = 'asc';
      break;
    case 'title_desc':
      apiOrderBy = 'title';
      apiOrder = 'desc';
      break;
    case 'title_asc':
      apiOrderBy = 'title';
      apiOrder = 'asc';
      break;
  }

  try {
    const fetchOptions: any = {
      order: apiOrder,
      orderby: apiOrderBy,
      paged: page,
    };

    if (search) {
      fetchOptions.search = search;
    }
    if (categoriesString) {
      fetchOptions.categories = categoriesString;
    }
    if (tagsString) {
      fetchOptions.tags = tagsString;
    }

    const [coursesResponse, categoriesResponse, tagsResponse] = await Promise.all([
      courseService.fetchAllCourses(fetchOptions), 
      fetch('https://ai-tutors.co/wp-json/wp/v2/course-category'), 
      fetch('https://ai-tutors.co/wp-json/wp/v2/course-tag')      
    ]);

    let courses: Course[] = coursesResponse.data || [];
    const totalPages = coursesResponse.meta?.pages ?? 1;
    const totalCourses = coursesResponse.meta?.total ?? courses?.length ?? 0;

    let availableCategories: WPTerm[] = [];
    if (categoriesResponse.ok) {
      availableCategories = await categoriesResponse.json();
    } else {
      console.warn("Failed to fetch categories:", categoriesResponse.statusText);
    }

    let availableTags: WPTerm[] = [];
    if (tagsResponse.ok) {
      availableTags = await tagsResponse.json();
    } else {
      console.warn("Failed to fetch tags:", tagsResponse.statusText);
    }

    let enrollmentMap = new Map<number, string>();
    if (userId && courses.length > 0) {
      const courseIds = courses.map(course => course.ID);
      try {
        const userEnrollments = await prisma.usercourse.findMany({
          where: {
            userId: userId,
            courseId: { in: courseIds }
          },
          select: {
            courseId: true,
            enrollment_status: true
          }
        });

        if (userEnrollments) {
          userEnrollments.forEach((enrollment: UserEnrollmentSelection) => {
            enrollmentMap.set(enrollment.courseId, enrollment.enrollment_status);
          });
        }
      } catch (dbError) {
        console.error("Error fetching user enrollments:", dbError);
      }
    }

    const coursesWithStatus = courses.map(course => ({
      ...course,
      enrollmentStatus: enrollmentMap.get(course.ID) || undefined
    }));

    return json({ 
      courses: coursesWithStatus, 
      totalPages, 
      currentPage: page, 
      totalCourses,
      availableCategories, 
      availableTags,        
    });

  } catch (error) {
    console.error("Error fetching data in loader:", error);
    return json({ 
      courses: [], 
      totalPages: 0, 
      currentPage: 1, 
      totalCourses: 0, 
      availableCategories: [], 
      availableTags: [],      
      error: "Failed to load page data" 
    }, { status: 500 });
  }
};

// --- Component CourseCardSkeleton ---
function CourseCardSkeleton() {
  return (
    <Box
      bgColor="white"
      borderColor="grey200" 
      b='thin'
      borderRadius='md'
      display='flex'
      flexDirection='column'
      className="shadow-sm overflow-hidden h-full" 
    >
      {/* Skeleton for Thumbnail */}
      <Skeleton variant="rectangle" width="100%" className="aspect-video" /> 
      <Box display='flex' flexDirection='column' p='md'>
        {/* Skeleton for Title*/}
        <Skeleton variant="rounded" width="80%" className='h-[5.25rem] line-clamp-3'/> 
        {/* Skeleton for Metadata */}
        <Box display='flex' justifyContent='space-between' alignItems='center' pt='lg' pb='lg'>
          <Skeleton variant="rounded" height={16} width="40%" />
          <Skeleton variant="rounded" height={16} width="30%" />
        </Box>
        {/* Skeleton for Author Info */}
        <Skeleton variant="rounded" height={16} width="70%" mb='lg' /> 
        <Button text="Loading Primary" color="primary" loading={true}/>
      </Box>
    </Box>
  );
}
// --- End Component CourseCardSkeleton ---

// --- Helper Function: Get Course Card Action ---
interface CourseCardAction {
  buttonColor: string;
  buttonText: string;
  buttonAction: () => void;
}

// Update helper to use enrollmentStatus from the course object
function getCourseCardAction(course: Course, navigate: NavigateFunction): CourseCardAction {
  // Use the status fetched from the database
  const enrollmentStatus = course.enrollmentStatus; // Assumes Course type has enrollmentStatus?
  let buttonText = 'Enroll Course'; // Default text
  let buttonColor = 'lime500';
  let buttonAction = () => alert(`Enrolling in: ${course.post_title}`); // Default action
  // Logic based on actual enrollment status
  if (enrollmentStatus === 'Continue Learning') {
      buttonText = 'Continue Learning';
      buttonColor = 'cyan500';
      buttonAction = () => navigate(`/courses/${course.id}/learn`);
  } else if (enrollmentStatus === 'Start Learning') {
      buttonText = 'Start Learning';
      buttonColor = 'orange400';
      buttonAction = () => navigate(`/courses/${course.id}/learn`);
  }
  return { buttonColor, buttonText, buttonAction };
}
// --- End Helper Function ---

export default function CoursesPage() {
  const initialData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const loading = fetcher.state !== 'idle' || navigation.state !== 'idle';
  const displayData = fetcher.data || initialData;
  // Handle error case first using type guarding
  if ('error' in displayData && displayData.error) {
      return (
        <Base>
          <Box p="lg">
            <Text color="danger">Error fetching data</Text>
          </Box>
        </Base>
      );
  }

  // Destructure the guaranteed properties.
  const { courses, totalPages, currentPage, totalCourses, availableCategories, availableTags } = displayData;
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

  // State for sorting
  const [currentSortValue, setCurrentSortValue] = useState<string>(
    searchParams.get('sort') || sortOptions[0].value
  );
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // --- Handler for Sorting ---
  const handleSortChange = (newValue: string) => {
    setCurrentSortValue(newValue);
    setIsSortDropdownOpen(false);
  };

  // --- useEffect ---
  useEffect(() => {
    const currentUrlParamsString = searchParams.toString();

    const timer = setTimeout(() => {
      const targetParams = new URLSearchParams();

      if (searchQuery) targetParams.set('search', searchQuery);
      if (selectedCategories.length > 0) targetParams.set('categories', selectedCategories.join(','));
      if (selectedTags.length > 0) targetParams.set('tags', selectedTags.join(','));

      if (currentSortValue !== sortOptions[0].value) {
        targetParams.set('sort', currentSortValue);
      }
      if (targetParams.toString() !== "") {
          targetParams.set('page', '1');
      }
      const targetParamsString = targetParams.toString();
      if (targetParamsString !== currentUrlParamsString) {
         console.log(`useEffect navigating: target='${targetParamsString}', current='${currentUrlParamsString}'`);
         navigate(`/courses?${targetParamsString}`, { replace: true });
      }
    }, 500); // Debounce time
    // Cleanup function
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories, selectedTags, currentSortValue, navigate]);

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
            <Box display="flex" flexDirection="column" gap="sm"> 
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
            <Box display="flex" flexDirection="column" gap="sm">
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
                // Pass the updated course object to the helper
                const { buttonColor, buttonText, buttonAction } = getCourseCardAction(course, navigate);
                return (
                  <Box
                    key={course.ID}
                    bgColor="white"
                    borderColor="grey300"
                    b='thin'
                    borderRadius='md'
                    display='flex'
                    flexDirection='column'
                    overflow='hidden'
                    className="shadow-sm h-full transition-all duration-200 ease-in-out hover:shadow-xl"
                  >
                    <Box className="relative w-full aspect-video">
                      <img
                        src={course.thumbnail_url || "https://placehold.co/400"}
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
                        <Box display='flex' alignItems='center' gap='xs'>
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <Text fontSize='medium' color='grey700'>{course.ratings?.rating_avg || 'N/A'}</Text>
                          <Text fontSize='medium' color='grey500'> ({course.ratings?.rating_count || '0'})</Text>
                        </Box>
                        <Box display='flex' alignItems='center' gap='xs'>
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
                           color={buttonColor as Color}
                         />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
             <Box display='flex' justifyContent='center' alignItems='center' p='lg'>No courses found matching your criteria.</Box>
          )}

          {totalPages > 1 && (
            <Box display='flex' justifyContent='center' alignItems='center' gap='xs' mt='lg'>
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