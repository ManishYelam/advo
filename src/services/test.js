const fetchCaseAndApplicantData = useCallback(async () => {
    if (!["edit", "view"].includes(mode) || !caseId || initialData) return;

    setIsLoading(true);
    setFetchError(null);

    try {
      const caseRes = await getCaseById(caseId);
      const caseData = caseRes?.data?.data || caseRes?.data || caseRes;
      if (!caseData || Object.keys(caseData).length === 0)
        throw new Error("Case data not found");

      setCaseData(caseData);

      const clientId = caseData?.client_id || caseData?.data?.client_id;
      if (!clientId) throw new Error("Client ID missing from case data");

      const applicantRes = await userApplicant(clientId);
      const applicantData =
        applicantRes?.data?.data || applicantRes?.data || applicantRes;
      if (!applicantData || Object.keys(applicantData).length === 0)
        throw new Error("Applicant data not found");

      setApplicantData(applicantData);

      const mergedData = {
        ...INITIAL_FORM_DATA,
        ...applicantData,
        ...caseData,
        status: caseData?.status || "Not Started",
        documents: {
          ...INITIAL_FORM_DATA.documents,
          ...(caseData?.documents || {}),
        },
      };
      console.log(mergedData);
      

      setFormData(mergedData);
    } catch (err) {
      console.error("❌ Data fetch failed:", err);
      const msg = err?.message || "Failed to load case or applicant data";
      setFetchError(msg);
      showErrorToast(
        `Failed to load ${mode === "edit" ? "case for editing" : "case details"
        }: ${msg}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [mode, caseId, initialData]);

  useEffect(() => {
    fetchCaseAndApplicantData();
  }, [fetchCaseAndApplicantData]);