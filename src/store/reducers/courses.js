const initalState = [];

const coursesReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return action.courses
    case 'EDIT_COURSE': {
      const courses = state;
      courses.map((course, index) => {
        if (course._id == action.course._id) {
          courses[index] = action.course;
        }
      })
      console.log(courses);
      return courses
    }
    default:
      return state
  }
}

export default coursesReducer