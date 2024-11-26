WITH CountsCTE AS (
    SELECT 
        MastercustomerCode,
        COUNT(CASE WHEN Asofdate = @PrevQtrEnddate THEN 1 END) AS PrevQtrCount,
        COUNT(CASE WHEN Asofdate = @LastMonthEnddate THEN 1 END) AS LastMonthCount,
        COUNT(CASE WHEN Asofdate = @CurrentDate THEN 1 END) AS CurrentDateCount,
        COUNT(CASE WHEN Asofdate = @CurrentDate AND Asofdate NOT IN (@PrevQtrEnddate) THEN 1 END) AS CurrentNotInPrevQtrCount,
        COUNT(CASE WHEN Asofdate = @PrevQtrEnddate AND Asofdate NOT IN (@CurrentDate) THEN 1 END) AS PrevQtrNotInCurrentCount,
        COUNT(CASE WHEN Asofdate = @LastMonthEnddate AND Asofdate NOT IN (@CurrentDate) THEN 1 END) AS LastMonthNotInCurrentCount
    FROM [PUNNTXQWDBS02\MSSQLSERVER1].talent.dbo.EmpMaster
    WHERE 
        ProjectType IN ('P', 'PRODUCTION') 
        AND ProjDucode IN (
            'FSDGTL-OSDM', 'FSDGTL-WTC2', 'FSDGTL-MM', 'FSDGTL-WTC', 'FSDGTL-DOA',
            'FSDGTL-EOSDM', 'FSDGTL-WTC3', 'FSDGTL-WTC1', 'FSDGTLAINA', 'FSSTAR-WTC2',
            'FSSTAR-WTC', 'FSSTAR-OSDM', 'FSSTAR-MM', 'FSDGTL-NXT', 'FSDGTMMBPMTO',
            'FSSTAR-WTC1', 'FSSTAR-WTC3', 'FSDTWTMEXICO', 'FSDGLT-EOSDM', 'FSDGTL-INNOV',
            'FSDGTLCLOUD', 'FDGTLSYWTC', 'FSDGWINOWINF', 'FSDGW3NOWINF', 'FSDCG-PWTC2',
            'FSDCG-WTC1', 'FSDCG-WTC2', 'FSDCG-OSDME', 'FSDGTLCHSHMM', 'FSDTW2BPOPAL',
            'FSDTWINFPAL', 'FSDTW2PALINF', 'FSDTW3BPOPAL', 'FSDTWINFPAL', 'FSDTW3PALINF',
            'FSDTWT2TEMIN', 'FSDTWT3TEMIN', 'FSDWTINFPRG', 'FSSTAR-DOA', 'FSSTAR-OSDME',
            'FSDGTL-OSDME', 'FSTWT2SWDINF', 'PSBPOTSOINPR', 'FDGPUMINPAS', 'FSDEOSPRGINF'
        )
        AND EmpPU IN (SELECT DISTINCT PU FROM tbl_AllPUs)
        AND EmpDU IN (
            SELECT DISTINCT DU 
            FROM FSITalentDeliveryMapping 
            WHERE category <> 'OLD DU'
        )
    GROUP BY MastercustomerCode
),
RankedCTE AS (
    SELECT 
        MastercustomerCode,
        PrevQtrCount,
        LastMonthCount,
        CurrentDateCount,
        CurrentNotInPrevQtrCount,
        PrevQtrNotInCurrentCount,
        LastMonthNotInCurrentCount,
        ROW_NUMBER() OVER (ORDER BY PrevQtrCount DESC) AS RowNum
    FROM CountsCTE
),
FinalCTE AS (
    SELECT 
        CASE 
            WHEN RowNum <= 20 THEN MastercustomerCode 
            ELSE 'Others' 
        END AS MastercustomerCode,
        SUM(PrevQtrCount) AS PrevQtrCount,
        SUM(LastMonthCount) AS LastMonthCount,
        SUM(CurrentDateCount) AS CurrentDateCount,
        SUM(CurrentNotInPrevQtrCount) AS CurrentNotInPrevQtrCount,
        SUM(PrevQtrNotInCurrentCount) AS PrevQtrNotInCurrentCount,
        SUM(LastMonthNotInCurrentCount) AS LastMonthNotInCurrentCount
    FROM RankedCTE
    GROUP BY 
        CASE 
            WHEN RowNum <= 20 THEN MastercustomerCode 
            ELSE 'Others' 
        END
)
SELECT *
FROM FinalCTE
ORDER BY 
    CASE 
        WHEN MastercustomerCode = 'Others' THEN 1 
        ELSE 0 
    END,
    PrevQtrCount DESC;
