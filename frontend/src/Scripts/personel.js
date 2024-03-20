class Person {
  constructor(firstName, middleName, lastName, email, phoneNumber, classes, attendance) {
    this.firstName = firstName;
    this.middleName = middleName || "";
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.classes = classes || []; // Ensure defaults are set
    this.attendance = attendance || []; // Ensure defaults are set
  }
  
    // Getters
    get firstName() { return this._firstName; }
    get middleName() { return this._middleName; }
    get lastName() { return this._lastName; }
    get email() { return this._email; }
    get phoneNumber() { return this._phoneNumber; }
  
    // Setters
    set firstName(value) { this._firstName = value; }
    set middleName(value) { this._middleName = value; }
    set lastName(value) { this._lastName = value; }
    set email(value) { this._email = value; }
    set phoneNumber(value) { this._phoneNumber = value; }
  
    getName() {
      return `${this._firstName} ${this._middleName} ${this._lastName}`.trim();
    }
  }
  

  class TA extends Person {
    constructor(firstName, middleName, lastName, email, phoneNumber, classes, attendance) {
      super(firstName, middleName, lastName, email, phoneNumber, classes, attendance);
    }
  
    // Getters
    get classes() { return this._classes; }
    get attendance() { return this._attendance; }
  
    // Setters
    set classes(value) { this._classes = value; }
    set attendance(value) { this._attendance = value; }
  
    assignClasses(classObj) {
      this._classes.push(classObj);
    }

    addAttendance(classId, date, status) {
      this._attendance.push({ classId, date, status });
    }
  }
  

  class Teacher extends TA {
    constructor(firstName, middleName, lastName, email, phoneNumber, classes, attendance) {
      super(firstName, middleName, lastName, email, phoneNumber, classes, attendance);
    }
  
    static fromTeacher(teacherObj) {
      return new Teacher(teacherObj._firstName, teacherObj._middleName, teacherObj._lastName, teacherObj._email, teacherObj._phoneNumber);
    }
  
    teacherInfo() {
      // Returning an object with only the specified properties
      return {
        firstName: this._firstName,
        middleName: this._middleName,
        lastName: this._lastName,
        email: this._email,
        phoneNumber: this._phoneNumber
      };
    }
  }

  

// Class representing a Student, extending from Person
class Student extends Person {
    constructor(firstName, middleName, lastName, email, phoneNumber, parentFname, parentMname, parentLname, parentPhone, parentEmail, paymentPlan, attendance) {
      super(firstName, middleName, lastName, email, phoneNumber, attendance);
      this._parentFname = parentFname;
      this._parentMname = parentMname || "";
      this._parentLname = parentLname;
      this._parentPhone = parentPhone;
      this._parentEmail = parentEmail;
      this.paymentPlan = paymentPlan;
    }
  
    // // Getters and Setters for student-specific properties
    // get parentFname() { return this._parentFname; }
    // get parentMname() { return this._parentMname; }
    // get parentLname() { return this._parentLname; }
    // get parentPhone() { return this._parentPhone; }
    // get parentEmail() { return this._parentEmail; }
    // get paid() { return this._paid; }
    // get attendance() { return this._attendance; }
  
    // set parentFname(value) { this._parentFname = value; }
    // set parentMname(value) { this._parentMname = value; }
    // set parentLname(value) { this._parentLname = value; }
    // set parentPhone(value) { this._parentPhone = value; }
    // set parentEmail(value) { this._parentEmail = value; }
    // set paymentPlan(value) { this.paymentPlan = value; }
    // set attendance(value) { this._attendance = value; }
  
    getParentName() {
      return `${this._parentFname} ${this._parentMname} ${this._parentLname}`.trim();
    }

    studentInfo() {
      // Returning an object with only the specified properties
      return {
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber
      };
    }

    addAttendance(classId, date, status) {
      this._attendance.push({ classId, date, status });
    }
  }
  

export { TA, Teacher, Student };
