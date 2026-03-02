import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";

/* =======================
   SAFE HELPERS
======================= */

const safeText = (v) =>
  v === null || v === undefined || v === "" ? "N/A" : String(v);

const yesNoPending = (v) => {
  if (v === "1" || v === 1) return "Yes";
  if (v === "2" || v === 2) return "No";
  if (v === "3" || v === 3) return "Pending";
  return "N/A";
};

/* =======================
   SVG ICONS
======================= */

const Icon = ({ d }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d={d} stroke="#2E7D7A" strokeWidth={1.5} fill="none" />
  </Svg>
);

const VitalsIcon = () => (
  <Icon d="M12 21s-7-4.35-7-10a4 4 0 018-1 4 4 0 018 1c0 5.65-7 10-7 10z" />
);

const MedicalHistoryIcon = () => (
  <Icon d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7 3v4m0 4h.01" />
);

const SystemicIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-4.5 6a1.5 1.5 0 113-3 1.5 1.5 0 01-3 3zm9 0a1.5 1.5 0 113-3 1.5 1.5 0 01-3 3z" />
);
const DentalIcon = () => (
  <Icon d="M7 3c-2 0-3 2-3 4 0 5 3 10 3 10s1-2 2-2 2 2 2 2 3-5 3-10c0-2-1-4-3-4-1 0-2 .5-2 .5s-1-.5-2-.5z" />
);

const VisionIcon = () => (
  <>
    <Icon d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </>
);

const GeneralExaminationIcon = () => (
  <Icon d="M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" />
);
const DisabilityIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const BirthDefectIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const ChildhoodDiseaseIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const DeficiencyIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const SkinConditionIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const DiagnosisIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const TreatmentIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const PftIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);
const GrowthMonitoringIcon = () => (
  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14h-2v-4h2v4zm4 0h-2v-6h2v6z" />
);

const AudioIcon = () => <Icon d="M12 3a7 7 0 00-7 7v4a3 3 0 003 3" />;

const ImmunIcon = () => <Icon d="M21 3l-6 6M3 21l6-6M14 4l6 6M4 14l6 6" />;

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  page: {
    padding: 18,
    backgroundColor: "#F6F8FB",
    fontSize: 9,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  fullWidthCard: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #EEE",
    paddingVertical: 3,
  },

  label: { color: "#555" },
  value: { fontWeight: "bold" },
});

/* =======================
   ROW
======================= */

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{safeText(value)}</Text>
  </View>
);

/* =======================
   MAIN PDF
======================= */

export default function HealthCardPDF({ data = {} }) {
  const vitals = data?.vital_info?.[0];
  const dental = data?.dental_info?.[0];
  const vision = data?.vision_info?.[0];
  const audio = data?.auditory_info?.[0];
  const immun = data?.immunisation_info?.[0]?.name_of_vaccine || [];
  const GeneralExam = data?.general_examination_info?.[0];
  const SystemicExam = data?.systemic_examination_info?.[0];
  const disability = data?.disability_info?.[0];
  const birthDefect = data?.birth_defect_info?.[0];
  const chidlhoodidsesase = data?.childhood_disease_info?.[0];
  const deficiency = data?.deficiency_info?.[0];
  const skinCondition = data?.skin_condition_info?.[0];
  const diagnosis = data?.diagnosis_info?.[0];
  const treatment = data?.treatment_info?.[0];
  const medicalHistory = data?.medical_history_info?.[0];
  const pft = data?.pft_info?.[0];
  const growthMonitoring = data?.growth_monitoring_info?.[0];
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Medical Report</Text>
          <Text>
            Citizen ID: {safeText(vitals?.citizen_id)}
            {"\n"}
            Screening Count: {safeText(vitals?.screening_count)}
          </Text>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {/* VITALS */}
          {vitals && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <VitalsIcon />
                <Text style={styles.cardTitle}>Vitals</Text>
              </View>
              <Row label="Pulse" value={`${safeText(vitals.pulse)} bpm`} />
              <Row
                label="BP"
                value={`${safeText(vitals.sys_mm)}/${safeText(vitals.dys_mm)}`}
              />
              <Row label="SpO₂" value={vitals.oxygen_saturation} />
              <Row label="RR" value={vitals.rr} />
              <Row label="Temperature" value={vitals.temp} />
            </View>
          )}

          {/* DENTAL */}
          {dental && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <DentalIcon />
                <Text style={styles.cardTitle}>Dental Examination</Text>
              </View>
              <Row label="Oral Hygiene" value={dental.oral_hygiene} />
              <Row
                label="Oral Ulcers"
                value={yesNoPending(dental.oral_ulcers)}
              />
              <Row
                label="Gum Bleeding"
                value={yesNoPending(dental.gum_bleeding)}
              />
              <Row label="Fluorosis" value={yesNoPending(dental.fluorosis)} />
              <Row label="Dental Condition" value={dental.dental_conditions} />
            </View>
          )}

          {/* AUDIO */}
          {audio && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <AudioIcon />
                <Text style={styles.cardTitle}>Audiometry</Text>
              </View>
              <Row
                label="Left Ear"
                value={audio.left_ear_observations_remarks}
              />
              <Row
                label="Right Ear"
                value={audio.right_ear_observations_remarks}
              />
            </View>
          )}

          {/* VISION */}
          {vision && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <VisionIcon />
                <Text style={styles.cardTitle}>Vision</Text>
              </View>
              <Row
                label="Color Blindness"
                value={vision.color_blindness === "1" ? "Yes" : "No"}
              />
              <Row label="Comment" value={vision.comment} />
            </View>
          )}
        </View>

        {/* IMMUNISATION */}
        {immun.length > 0 && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <ImmunIcon />
              <Text style={styles.cardTitle}>Immunisation</Text>
            </View>

            {immun.map((v, i) => (
              <Row
                key={i}
                label={safeText(v.immunisations)}
                value={yesNoPending(v.given_yes_no)}
              />
            ))}
          </View>
        )}

        {/* SYSTEMIC EXAM */}
        {SystemicExam && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <SystemicIcon />
              <Text style={styles.cardTitle}>Systemic Examination</Text>
            </View>
            <Row label="General" value={safeText(SystemicExam.general)} />
            <Row
              label="Cardiovascular"
              value={safeText(SystemicExam.cardiovascular)}
            />
            <Row
              label="Respiratory"
              value={safeText(SystemicExam.respiratory)}
            />
            <Row label="Abdominal" value={safeText(SystemicExam.abdominal)} />
          </View>
        )}

        {/* MEDICAL HISTORY */}
        {medicalHistory?.medical_history?.length > 0 && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <MedicalHistoryIcon />
              <Text style={styles.cardTitle}>Medical History</Text>
            </View>

            {medicalHistory.medical_history.map((m, i) => (
              <Row key={i} label={`•`} value={m} />
            ))}
          </View>
        )}

        {/* General Examination */}
        {GeneralExam && (
          <View style={styles.fullWidthCard}>
            <GeneralExaminationIcon />
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>General Examination</Text>
            </View>
            <Row label="Findings" value={safeText(GeneralExam.findings)} />
          </View>
        )}

        {/*  disability */}
        {disability && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <DisabilityIcon />
              <Text style={styles.cardTitle}>Disability</Text>
            </View>
            <Row label="Type" value={safeText(disability.type)} />
            <Row label="Duration" value={safeText(disability.duration)} />
          </View>
        )}
        {/* Birth Defect */}
        {birthDefect?.birth_defects?.length > 0 && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <BirthDefectIcon />
              <Text style={styles.cardTitle}>Birth Defect</Text>
            </View>

            {birthDefect.birth_defects.map((item, i) => (
              <Row key={i} label={`•`} value={item} />
            ))}
          </View>
        )}

        {/* Childhood Disease */}
        {chidlhoodidsesase?.childhood_diseases?.length > 0 && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <ChildhoodDiseaseIcon />
              <Text style={styles.cardTitle}>Childhood Disease</Text>
            </View>

            {chidlhoodidsesase.childhood_diseases.map((d, i) => (
              <Row key={i} label={`Disease ${i + 1}`} value={d} />
            ))}
          </View>
        )}

        {/* Deficiency */}
        {deficiency?.deficiencies?.length > 0 && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <DeficiencyIcon />
              <Text style={styles.cardTitle}>Deficiency</Text>
            </View>

            {deficiency.deficiencies.map((d, i) => (
              <Row key={i} label={`Deficiency ${i + 1}`} value={d} />
            ))}
          </View>
        )}

        {/* Skin Condition */}
        {skinCondition?.skin_conditions?.length > 0 && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <SkinConditionIcon />
              <Text style={styles.cardTitle}>Skin Condition</Text>
            </View>

            {skinCondition.skin_conditions.map((s, i) => (
              <Row key={i} label={`Condition ${i + 1}`} value={s} />
            ))}
          </View>
        )}

        {/* Diagnosis */}
        {diagnosis?.diagnosis?.length > 0 && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <DiagnosisIcon />
              <Text style={styles.cardTitle}>Diagnosis</Text>
            </View>

            {diagnosis.diagnosis.map((d, i) => (
              <Row key={i} label={`Diagnosis ${i + 1}`} value={d} />
            ))}
          </View>
        )}

        {/* Treatment */}
        {treatment && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <TreatmentIcon />
              <Text style={styles.cardTitle}>Treatment</Text>
            </View>
            <Row label="Type" value={safeText(treatment.type)} />
            <Row label="Duration" value={safeText(treatment.duration)} />
          </View>
        )}

        {/* pft */}
        {pft && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <PftIcon />
              <Text style={styles.cardTitle}>PFT</Text>
            </View>
            <Row label="Reading" value={safeText(pft[0]?.pft_reading)} />
            <Row label="Remark" value={safeText(pft[0]?.observations)} />
          </View>
        )}
        {/* Growth Monitoring */}
        {growthMonitoring && (
          <View style={styles.fullWidthCard}>
            <View style={styles.cardHeader}>
              <GrowthMonitoringIcon />
              <Text style={styles.cardTitle}>Growth Monitoring</Text>
            </View>
            <Row label="Height" value={safeText(growthMonitoring.height)} />
            <Row label="Weight" value={safeText(growthMonitoring.weight)} />
            <Row label="BMI" value={safeText(growthMonitoring.bmi)} />
          </View>
        )}
      </Page>
    </Document>
  );
}
