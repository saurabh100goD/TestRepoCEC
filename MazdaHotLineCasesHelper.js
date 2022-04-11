({
    /*stopSpinner : function(component, event, helper) {
        component.set("v.spinner", false);
    },*/
    
    getSiebelSRFieldsColumns: function(component, event, helper) {
        var SiebelSRDetailsFieldsToDisplay = component.get("v.SiebelSRDetailsFieldsToDisplay");
        console.log("SiebelSRDetailsFieldsToDisplay"+SiebelSRDetailsFieldsToDisplay);
        var getSRDetailsColumns = component.get("c.getSRDetailsColumns");
        getSRDetailsColumns.setParams({
            SiebelSRDetailColumns : SiebelSRDetailsFieldsToDisplay
        });
        
        getSRDetailsColumns.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result != null){
                    var SRColumns =[];
                    for(var key in result){
                        console.log("key"+key);
                        var Label = result[key];
                        console.log("Label"+Label);
                        SRColumns.push({label: Label, fieldName: key});
                    }
                    component.set("v.SiebelCaseDetailColumns", SRColumns); 
                    helper.getSRCasesDetails(component, event, helper);
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                if(errors) {
                    var error = response.getError()
                    if (errors[0] && errors[0].message) {
                        // log the error passed in to AuraHandledException
                        console.log("Error message: " + error);
                        var resultsToast = $A.get("e.force:showToast");
                        resultsToast.setParams({
                            "title": "Vehicels Fields Error",
                            "message": errors[0].message
                        });
                        resultsToast.fire();
                    }
                }
            }
        });
        $A.enqueueAction(getSRDetailsColumns);
    },
    getSRCasesDetails : function(component, event, helper) {
        var SelectedSRNumber = component.get("v.SelectedSRNumber");
        console.log("SelectedSRNumber"+SelectedSRNumber);
        alert("SelectedSRNumber in getSRCasesDetails"+SelectedSRNumber);
        var getSRDetailsFromSiebel = component.get("c.getHLRefNoFromHotline");
        getSRDetailsFromSiebel.setParams({
            SelectedHLRefNo : SelectedSRNumber
        });
        getSRDetailsFromSiebel.setCallback(this, function(response) {
            var state = response.getState();
            alert("State"+state);
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var HistoricalSRCases = [];
                if(result != null){
                    var SRResults = [];
                    for(var Key in result){
                        console.log("Key"+Key);
                        var Value = result[Key];
                        console.log("Value"+Value); 
                        SRResults.push({key:Key,feature:Value});
                    }
                }
                console.log("SRResults"+SRResults);
                component.set("v.SiebelCaseDetailResults", SRResults);
                component.set("v.ShowSRCasesDetails", true);
                component.set("v.ShowGetActivity",true);
                component.set("v.ShowActivity",false);
                component.set("v.ShowGetAttachment",false);
                component.set("v.ShowGetClosingInfo",false);
                component.set("v.ShowGetPriorityInfo",false);
                component.set("v.ShowGetPealerInfo",false);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    var error = response.getError()
                    if (errors[0] && errors[0].message) {
                        var resultsToast = $A.get("e.force:showToast");
                        resultsToast.setParams({
                            "title": "Error",
                            "message": "No results found in Siebel"
                        });
                        resultsToast.fire();
                        
                        // log the error passed in to AuraHandledException
                        console.log("Error message: " + error);
                        component.set("v.ShowSRCasesDetails", false);
                        component.set("v.ShowGetActivity", false);
                        component.set("v.ShowActivity",false);
                    }
                }
            } 
        });
        $A.enqueueAction(getSRDetailsFromSiebel);
    }
})