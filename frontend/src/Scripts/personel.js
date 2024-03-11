class Person {
    constructor(firstName, middleName, lastName, email, phoneNumber) {
      this._firstName = firstName;
      this._middleName = middleName || "";
      this._lastName = lastName;
      this._email = email;
      this._phoneNumber = phoneNumber;
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
    constructor(firstName, middleName, lastName, email, phoneNumber) {
      super(firstName, middleName, lastName, email, phoneNumber);
      this._classes = [];
      this._attendance = [];
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
  }
  

  class Teacher extends TA {
    constructor(firstName, middleName, lastName, email, phoneNumber) {
      super(firstName, middleName, lastName, email, phoneNumber);
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
    constructor(firstName, middleName, lastName, email, phoneNumber, parentFname, parentMname, parentLname, parentPhone, parentEmail, paid) {
      super(firstName, middleName, lastName, email, phoneNumber);
      this._parentFname = parentFname;
      this._parentMname = parentMname || "";
      this._parentLname = parentLname;
      this._parentPhone = parentPhone;
      this._parentEmail = parentEmail;
      this._paid = paid;
      this._attendance = [];
    }
  
    // Getters and Setters for student-specific properties
    get parentFname() { return this._parentFname; }
    get parentMname() { return this._parentMname; }
    get parentLname() { return this._parentLname; }
    get parentPhone() { return this._parentPhone; }
    get parentEmail() { return this._parentEmail; }
    get paid() { return this._paid; }
    get attendance() { return this._attendance; }
  
    set parentFname(value) { this._parentFname = value; }
    set parentMname(value) { this._parentMname = value; }
    set parentLname(value) { this._parentLname = value; }
    set parentPhone(value) { this._parentPhone = value; }
    set parentEmail(value) { this._parentEmail = value; }
    set paid(value) { this._paid = value; }
    set attendance(value) { this._attendance = value; }
  
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
  }
  

export { TA, Teacher, Student };
