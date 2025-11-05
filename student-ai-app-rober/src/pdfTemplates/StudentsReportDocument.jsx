import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
  title: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: { flexDirection: "row" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontWeight: "bold",
  },

  tableColStudent: {
    width: "17%",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 5,
    textAlign: "center",
  },
  tableColName: {
    width: "25%",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 5,
  },
  tableColGrade: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 5,
    textAlign: "center",
  },
  tableColAverage: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 5,
    textAlign: "center",
  },
  tableColStatus: {
    width: "11%",
    padding: 5,
    textAlign: "center",
  },

  tableRowOdd: { backgroundColor: "#fafafa" },
  passed: { color: "green", fontWeight: "bold" },
  failed: { color: "red", fontWeight: "bold" },

  summary: { marginTop: 20 },
  summaryTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  aiFeedback: { marginTop: 15, fontStyle: "italic" },
});

export default function StudentsReportDocument({ students, grades, subjectName }) {
  if (!students || !grades) return null;

  const processed = students.map((s) => {
    const g = grades[s.id] || {};
    const avg =
      (Number(g.prelim || 0) +
        Number(g.midterm || 0) +
        Number(g.semifinal || 0) +
        Number(g.final || 0)) /
      4;

    return {
      ...s,
      ...g,
      average: avg.toFixed(2),
      status: avg >= 3 ? "Failed" : "Passed",
    };
  });

  const passed = processed.filter((s) => s.status === "Passed");
  const failed = processed.filter((s) => s.status === "Failed");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Grades Report - {subjectName}</Text>

        {/* Grades Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableColStudent}>Student #</Text>
            <Text style={styles.tableColName}>Name</Text>
            <Text style={styles.tableColGrade}>Prelim</Text>
            <Text style={styles.tableColGrade}>Midterm</Text>
            <Text style={styles.tableColGrade}>Semifinal</Text>
            <Text style={styles.tableColGrade}>Final</Text>
            <Text style={styles.tableColAverage}>Average</Text>
            <Text style={styles.tableColStatus}>Status</Text>
          </View>
          {processed.map((s, idx) => (
            <View
              key={s.id}
              style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowOdd : null]}
            >
              <Text style={styles.tableColStudent}>{s.student_number}</Text>
              <Text style={styles.tableColName}>{s.first_name} {s.last_name}</Text>
              <Text style={styles.tableColGrade}>{s.prelim || 0}</Text>
              <Text style={styles.tableColGrade}>{s.midterm || 0}</Text>
              <Text style={styles.tableColGrade}>{s.semifinal || 0}</Text>
              <Text style={styles.tableColGrade}>{s.final || 0}</Text>
              <Text style={styles.tableColAverage}>{s.average}</Text>
              <Text
                style={[
                  styles.tableColStatus,
                  s.status === "Passed" ? styles.passed : styles.failed,
                ]}
              >
                {s.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Class Summary</Text>
          <Text>Total Students: {processed.length}</Text>
          <Text>Passed: {passed.length}</Text>
          <Text>Failed: {failed.length}</Text>
        </View>

        {/* Grades Feedback */}
        <View style={styles.aiFeedback}>
          <Text style={styles.summaryTitle}>Grades Summary:</Text>
          <Text>
            The class performed {passed.length > failed.length ? "well" : "poorly"} overall.
            Focus areas for improvement include subjects where students scored above 3.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
