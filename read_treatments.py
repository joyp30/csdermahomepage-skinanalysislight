import openpyxl
import sys
import json

file_path = "/Users/seyoung/Downloads/홈페이지과 얼굴분석 탑재 홈페이지/시술프로그램(26.1.12)-세부항목 최종판.xlsx"

try:
    wb = openpyxl.load_workbook(file_path, data_only=True)
    ws = wb.active
    
    data = []
    # Assuming header is row 1, data starts row 2. 
    # I'll just dump the first few rows to see the structure first, then I can refine.
    row_count = 0
    for row in ws.iter_rows(values_only=True):
        row_count += 1
        data.append(list(row))
        if row_count > 50: # Just get first 50 rows to inspect structure
            break
            
    print(json.dumps(data, ensure_ascii=False))

except Exception as e:
    print(f"Error: {e}")
