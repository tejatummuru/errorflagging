// Placeholder for pre-processed data
const speciesFoundInSubbasins = {}; // { subbasinId: [species1, species2, ...] }
const speciesNativityRanges = {}; // { speciesName: "Native" or "Non-Native" }

const processRecords = (records) => {
  records.forEach(record => {
    const { subbasin, species, coordinateUncertaintyInMeters } = record; // Destructure based on actual CSV structure

    // Criteria 1
    if (!speciesFoundInSubbasins[subbasin]?.includes(species)) {
      record.isSuspect = true; // Mark as suspect
      // Update species found in subbasin
      if (!speciesFoundInSubbasins[subbasin]) speciesFoundInSubbasins[subbasin] = [];
      speciesFoundInSubbasins[subbasin].push(species);
    }

    // Criteria 2
    const nativity = speciesNativityRanges[species];
    if (nativity && nativity !== record.nativity) {
      record.isSuspect = true; // Mark as suspect
    }

    // Criteria 3
    if (coordinateUncertaintyInMeters > 28139) {
      record.isSuspect = true; // Mark as suspect
    }
  });

  return records.filter(record => record.isSuspect); // Return suspect records
};

