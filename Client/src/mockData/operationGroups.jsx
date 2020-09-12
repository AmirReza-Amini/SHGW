const OperationGroups = [
  {
    fnName: "گیت",
    enName: "Gate",
    operations: [
      { fnName: "پذیرش", enName: "Accept", icon: "1", pName: "Accept-From-Icd", class: "bg-danger btn" },
      { fnName: "تحویل", enName: "Deliver", icon: "2", pName: "Deliver-To-Icd", class: "bg-danger btn" },
      { fnName: "ورود پر", enName: "Full-in", icon: "3", pName: "Full-Gate-In", class: "bg-danger btn" },
      { fnName: "ورود خالی", enName: "Empty-In", icon: "4", pName: "Empty-Gate-In", class: "bg-danger btn" },
      { fnName: "خروج خالی", enName: "Empty-Out", icon: "5", pName: "Empty-Gate-Out", class: "bg-danger btn" }],
    class: "bg-danger btn"
  },
  {
    fnName: "کشتی",
    enName: "Vessel",
    operations: [
      { fnName: "تخلیه", enName: "Discharge", icon: "1", pName: "Discharge", class: "bg-success btn" },
      { fnName: "بارگیری", enName: "Load", icon: "2", pName: "Load", class: "bg-success btn" },
      { fnName: "جایگیری در کشتی", enName: "Stowage", icon: "4", pName: "Stowage", class: "bg-success btn" }],
    class: "bg-success btn"
  },
  {
    fnName: "محوطه",
    enName: "CY",
    operations: [
      { fnName: "جایگیری در محوطه", enName: "Yard", icon: "1", pName: "Yard-Operation", class: "bg-warning btn" },
      { fnName: "جابجایی", enName: "Movement", icon: "2", pName: "Movement", class: "bg-warning btn" },
      { fnName: "ارسال", enName: "Send", icon: "3", pName: "Send", class: "bg-warning btn" },
      { fnName: "دریافت", enName: "Receive", icon: "3", pName: "Receive", class: "bg-warning btn" },
      { fnName: "خروج پر از دروازه", enName: "Full-Out", icon: "4", pName: "Full-Gate-Out", class: "bg-warning btn" },
      { fnName: "پلاگ", enName: "Plug-In", icon: "4", pName: "Plug-In", class: "bg-warning btn" },
      { fnName: "آنپلاگ", enName: "Plug-Out", icon: "4", pName: "Plug-Out", class: "bg-warning btn" }],
    class: "bg-warning btn"
  }
];

export default OperationGroups;
