class Term {
  constructor(name, start, end, classes) {
    this._name = name;
    this._start = start;
    this._end = end;
    this._classes = classes;
  }

  fromTerm(Term){
    this._name = Term.name;
    this._start = Term.start;
    this._end = Term.end;
    this._classes = Term._classes;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get start() {
    return this._start;
  }
  set start(value) {
    this._start = value;
  }

  get end() {
    return this._end;
  }
  set end(value) {
    this._end = value;
  }

  get classes() {
    return this._classes;
  }

  addClass(classObj) {
    this._classes.push(classObj);
  }
}

class Classes {
  constructor(name, day, term, termName, students, teachers, TAs) {
    this._name = name;
    this._day = day;
    this._term = term;
    this._termName = termName;
    this._students = students;
    this._teachers = teachers;
    this._TAs = TAs;
  }
  
  static fromClasses(classObj){
    return new Classes(classObj._name, classObj._day, classObj._students, classObj._teachers, classObj._TAs)
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get day() {
    return this._day;
  }
  set day(value) {
    this._day = value;
  }

  get students() {
    return this._students;
  }
  get teachers() {
    return this._teachers;
  }
  get TAs() {
    return this._TAs;
  }

  enrollStudents(newStudents) {
    if (!Array.isArray(newStudents)) {
      throw new Error("newStudents must be an array");
    }

    const existingStudentIds = new Set(this._students.map(student => student._id));
    const uniqueNewStudents = newStudents.filter(student => !existingStudentIds.has(student._id));

    uniqueNewStudents.forEach(student => {this._students.push(student)})
  }

  enrollOneStudent(newStudent) {
    const existingStudentIds = new Set(this._students.map(student => student._id));
    if(!existingStudentIds.has(newStudent._id)){
      this._students.push(newStudent);
    }
  }

  removeOneStudent(studentId) {
    this._students = this._students.filter(student => student._id !== studentId);
  }  

  assignTeacher(teacher) {
    this._teachers.push(teacher);
  }

  assignTA(ta) {
    this._TAs.push(ta);
  }
}

class ClassesOffered {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
}

export { Term, Classes, ClassesOffered };
