({
    myAction : function(component, event, helper) {      
        component.set('v.HotlineCaseColumns', [
            {label: 'VIN', fieldName: 'VIN', type: 'text'},
            {label: 'Type', fieldName: 'type', type: 'text'},
            {label: 'Status', fieldName: 'status', type: 'text'},
            {label: 'HLRef No', fieldName: 'hlRefNo', type: 'text'},
            {label: 'Closed Date', fieldName: 'closedDate', type: 'text'},
            {label: 'Created Date', fieldName: 'createdDate', type: 'text'}
        ]);
        
        var recordId = component.get("v.recordId");
        console.log("recordId"+recordId);
        
        var SRCaseHotline = component.get("c.getSRHotlineCaseDetails");
        SRCaseHotline.setParams({
            recordId : recordId
        });
        
        SRCaseHotline.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log(JSON.stringify(result));
                if(result != null) {
                    var SRHotlineResults = [];
                    for(var key in result){
                        var value = result[key];
                        console.log("value = "+value); 
                        var VIN = value[0];
                        console.log("VIN = "+VIN); 
                        var type = value[1];
                        console.log("Type = "+type); 
                        var status = value[2];
                        console.log("Status = "+status);
                        var hlRefNo = value[3];
                        console.log("hlRefNo = "+ hlRefNo); 
                        var closedDate = value[4];
                        console.log("closedDate = "+closedDate); 
                        var createdDate = value[5];
                        console.log("createdDate = "+createdDate); 
                        
                        SRHotlineResults.push(
                            {
                                key:key,
                                VIN:VIN,
                                type:type,
                                status:status,
                                hlRefNo:hlRefNo,
                                closedDate:closedDate,
                                createdDate:createdDate,
                            }
                        ); 
                    }
                }
                console.log('SRHotlineResults' + JSON.stringify(SRHotlineResults));
                component.set("v.SRHotlineCasesResults", SRHotlineResults);
                component.set("v.ShowSHotline", true);
                component.set("v.ShowHotlineSRError", false);
            }
            else if(state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    var error = response.getError()
                    if (errors[0] && errors[0].message) {
                        // log the error passed in to AuraHandledException
                        console.log("Error message: " + error);
                        component.set("v.ShowHotlineSRError", true);
                        component.set("v.ShowSHotline", flase);
                         helper.stopSpinner(component, event, helper);

                    }
                }
            } 
        });
        $A.enqueueAction(SRCaseHotline);
    },
    
    getSRDetails: function(component, event, helper) {
        var SelectedVehicle = event.getParam('selectedRows');
        var setRows = [];
        for ( var i = 0; i < SelectedVehicle.length; i++ ) {
            console.log("SelectedSRNumber"+SelectedVehicle[i].hlRefNo);
            alert("SelectedSRNumber"+SelectedVehicle[i].hlRefNo);
            component.set("v.SelectedSRNumber",SelectedVehicle[i].hlRefNo);
		}
        
        helper.getSiebelSRFieldsColumns(component, event, helper);
    },
    
    /*showSpinner: function(component, event, helper) {
        component.set("v.spinner", true); 
    },
     
    hideSpinner : function(component,event,helper){
        //component.set("v.spinner", false);
        helper.stopSpinner(component, event, helper);
    }*/

 })