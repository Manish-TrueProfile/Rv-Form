import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// --- STYLESHEET ---
const primaryColor = '#5246e9';
const textColor = '#1a202c';
const lightTextColor = '#4a5568';
const borderColor = '#e2e8f0';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 30,
        fontFamily: 'Helvetica',
        position: 'relative',
    },
    watermark: {
        position: 'absolute',
        top: '25%',
        left: '25%',
        height: '50%',
        width: '50%',
        opacity: 0.08,
        objectFit: 'contain',
    },
    body: {
        flex: 1,
    },
    mainHeader: {
        textAlign: 'center',
        marginBottom: 25,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    logoText: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 24,
        color: primaryColor,
    },
    logoBadge: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        backgroundColor: '#20b8c8',
        color: '#fff',
        padding: '2px 4px',
        borderRadius: 3,
        marginLeft: 5,
        marginBottom: 3,
    },
    reportTitle: {
        fontSize: 14,
        color: lightTextColor,
        fontFamily: 'Helvetica-Bold',
    },
    headerUnderline: {
        width: '30%',
        height: 2,
        backgroundColor: primaryColor,
        marginHorizontal: 'auto',
        marginTop: 6,
    },
    section: {
        marginBottom: 15,
        border: `1px solid ${borderColor}`,
        borderRadius: 5,
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.30)',
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: textColor,
        marginBottom: 12,
    },
    twoColumnGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        width: '48%',
    },
    dataItem: {
        marginBottom: 10,
    },
    label: {
        fontSize: 9,
        color: lightTextColor,
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
        color: textColor,
        fontFamily: 'Helvetica-Bold',
    },
    dlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dlDetails: {
        width: '75%',
    },
    dlPhotoContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    dlPhoto: {
        width: 80,
        height: 100,
        objectFit: 'cover',
    },
    historyItem: {
        borderTopWidth: 1,
        borderTopColor: borderColor,
        paddingTop: 10,
        marginTop: 10,
    },
    historyCompany: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#a0aec0',
    },
});

// --- HELPER COMPONENTS ---
// The 'wrap' prop is now passed to the View to control page breaking
const Section = ({ title, children, wrap = true }) => (
    <View style={styles.section} wrap={wrap}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const DataItem = ({ label, value }) => {
    if (!value) return <View />;
    return (
        <View style={styles.dataItem}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};


// --- DOCUMENT COMPONENT ---
const PdfDocument = ({ data }) => (
    <Document author="True Profile" title={`Summary for ${data.fullName}`}>
        <Page size="A4" style={styles.page}>
            <Image src="/rv.jpg" fixed style={styles.watermark} />

            <View style={styles.body}>
                <View style={styles.mainHeader}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>TRUE PROFILE</Text>
                        <Text style={styles.logoBadge}>RV™</Text>
                    </View>
                    <Text style={styles.reportTitle}>Candidate Verification Report</Text>
                    <View style={styles.headerUnderline} />
                </View>

                <Section title="Personal Details">
                    <View style={styles.twoColumnGrid}>
                        <View style={styles.column}>
                            <DataItem label="Full Name" value={data.fullName} />
                            <DataItem label="Father's Name" value={data.fathersName} />
                        </View>
                        <View style={styles.column}>
                            <DataItem label="Date of Birth" value={data.dob} />
                            <DataItem label="Mobile" value={data.mobile} />
                        </View>
                    </View>
                </Section>

                <Section title="Address Information">
                    <DataItem label="Permanent Address" value={data.permanentAddress ? `${data.permanentAddress.street}, ${data.permanentAddress.city}, ${data.permanentAddress.state} - ${data.permanentAddress.pincode}` : ''} />
                    <DataItem label="Current Address" value={data.sameAsPermanent ? 'Same as Permanent Address' : data.currentAddress ? `${data.currentAddress.street}, ${data.currentAddress.city}` : ''} />
                </Section>

                {/* This section is now wrapped in a View with wrap={false} to prevent it from splitting */}
                {data.dlNumber && (
                    <Section title="Driving License Details" wrap={false}>
                        <View style={styles.dlContainer}>
                            <View style={styles.dlDetails}>
                                <View style={styles.twoColumnGrid}>
                                    <View style={styles.column}>
                                        <DataItem label="License No." value={data.dlNumber} />
                                        <DataItem label="Date of Issue" value={data.dlIssuedDate} />
                                    </View>
                                    <View style={styles.column}>
                                        <DataItem label="Issuing Authority" value={data.dlIssuedAt} />
                                        <DataItem label="Date of Expiry" value={data.dlExpiryDate} />
                                    </View>
                                </View>
                                <DataItem label="Name" value={data.dlName} />
                                <DataItem label="S/W/D" value={data.dlSWD} />
                            </View>
                            <View style={styles.dlPhotoContainer}>
                                {data.dlImage && <Image src={data.dlImage} style={styles.dlPhoto} />}
                            </View>
                        </View>
                    </Section>
                )}

                {data.panNumber && (
                    <Section title="PAN Verification Record">
                        <View style={styles.twoColumnGrid}>
                            <View style={styles.column}>
                                <DataItem label="Permanent Account Number" value={data.panNumber} />
                                <DataItem label="Gender" value={data.panGender} />
                            </View>
                            <View style={styles.column}>
                                <DataItem label="Name" value={data.panName} />
                                <DataItem label="Date of Birth" value={data.panDob} />
                                <DataItem label="Verified On" value={data.panVerifiedOn} />
                            </View>
                        </View>
                    </Section>
                )}

                {data.employmentHistories && data.employmentHistories.length > 0 && (
                    <Section title="EPFO Service History">
                        <DataItem label="UAN Number" value={data.uanNumber} />
                        {data.employmentHistories.map((job, index) => (
                            <View key={index} style={index > 0 ? styles.historyItem : {}} wrap={false}>
                                <Text style={styles.historyCompany}>{`${job['Sr.No']}. ${job['Establishment Name']}`}</Text>
                                <View style={styles.twoColumnGrid}>
                                    <View style={styles.column}>
                                        <DataItem label="Establishment ID" value={job['Establishment ID']} />
                                        <DataItem label="Member ID" value={job['Member Id']} />
                                        <DataItem label="DOJ EPF" value={job['DOJ EPF']} />
                                        <DataItem label="DOJ EPS" value={job['DOJ EPS']} />
                                    </View>
                                    <View style={styles.column}>
                                        <DataItem label="DOE EPF" value={job['DOE EPF']} />
                                        <DataItem label="DOE EPS" value={job['DOE EPS']} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </Section>
                )}
            </View>

            <Text style={styles.footer} fixed>
                This document is a computer-generated summary from True Profile. Generated on {new Date().toLocaleDateString()}.
            </Text>
        </Page>
    </Document>
);

export default PdfDocument;