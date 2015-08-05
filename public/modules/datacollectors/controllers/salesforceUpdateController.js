'use strict';

angular.module('datacollectors').controller('SalesforceUpdateController',
    ['$scope', '$http', '$stateParams', '$location',
        'Authentication', 'Datacollectors',
        'FileUploader','$rootScope','$window','$sce',
    function($scope, $http, $stateParams, $location, Authentication,
             Datacollectors, FileUploader,$rootScope,$window,$sce) {
        $scope.authentication = Authentication;

        var user = Authentication.user;

        $scope.formIsValid = false;

        var selectedDc;
        var selectedRegion;
        var missingFields
        $scope.uploadUrl = '';

        $scope.quote;

        $scope.selectedOpportunity = [];

        $scope.industries = [
            {
                name: 'Global Industries'
            },
            {
                name: 'Consumer & Retail'
            },
            {
                name: 'Healthcare & Life Sciences'
            },
            {
                name: 'Energy & Technology'
            },
            {
                name: 'Insurance'
            },
            {
                name: 'Banking & Capital Markets'
            },
            {
                name: 'Manufacturing'
            }
        ];

        $scope.dcList = [];

        $scope.computeCheckboxModel = {
            cloudCompute : false,
            bizCloudHc : false,
            bizCloud:   false,
            storageAsAService:  false,
            mainframe:  false,
            unixFarm:   false,
            windowsFarm:    false,
            as400:  false,
            UcaaS:  false,
            myWorkstyle:    false,
            cyber:  false,
            serviceManagement:  false,
            lan:    false,
            wan:    false,
            isProvidingDr:  false,

            assetAndConfigurationManagement: false,
            enterpriseServiceDesk: false,
            firewall: false,
            clientSiteLocalSupport: false,
            loadBalancers: false,
            operationalServiceManagement: false,
            proxy: false,
            remoteManagementServices: false,
            dns: false,
            serviceIntegrationAndManagement: false,
            dataCenterBasedTouchLabor: false,
            serviceRequestManagement: false,
            agilityPlatform: false,
            bigDataAndAnalytics: false
        };

        $scope.dcRegions = [
            {
                name: "Americas"
            },
            {
                name: "AMEA"
            },
            {
                name: "India "
            },
            {
                name: "Nordics"
            },
            {
                name: "UK&I"
            },
            {
                name: 'Australia & NZ'
            },
            {
                name: 'SW Europe'
            },
            {
                name: 'C&E EUROPE'
            }
        ];

        $scope.vendorDcNames = [
            {
                name: 'DC 1'
            },
            {
                name: 'DC 2'
            },
            {
                name: 'DC 3'
            }
        ];

        $scope.opportunityIndustry;

        $scope.dcCountry;

        $scope.isAdmin = false;

        function assertIsAdmin(){
            var isAdmin = user.roles.indexOf('admin');
            if(isAdmin > 0){
                $scope.isAdmin = true;
            }
            else {
                $scope.isAdmin = false;
            }
        }

        $scope.displayAllDcRecords = function(){
            var matchingDcRecords = [];
            $scope.dcList = [];
            $scope.dcNames.forEach(function(dc){
                if(dc.region === selectedRegion){
                    $scope.dcList.push({
                        name:dc.name,
                        country:dc.country,
                        siteCode:dc.siteCode
                    });
                }
            })
        };

        var url = 'http://dctool-lnx.cloudapp.net:3001/api/files';

        var uploader = $scope.uploader = new FileUploader({
        });

        console.log('This is SalesForceUpdateController');

        function getEnvironment (){

                $http.get('/environment').success(function(response) {

                if(response.environment === 'test'){

                }
                if(response.environment === 'development'){

                }
            });
        }

        function initOpportunityIdList(){
            $http.get('/opportunity_ids').success(function(response) {
                console.log('found ' + response.length + ' records for salesforce-power');
                response.forEach(function(opportunity){
                    $scope.opportunityIds.push(opportunity);
                });
            });
        }

        function initDcList(){
            $http.get('/dc_inventory').success(function(response) {
                console.log('found ' + response.length + ' records for DcInventory');
                response.forEach(function(record){
                    $scope.dcNames.push({name: record.DataCenterName, country: record.DcCountry, siteCode: record.DcSiteCode,address: record.DcAddress, region: record.DcRegion});
                });
            });
        }

        $scope.getOpportunityDetails = function(opportunityId){
            $http.get('/opportunities/?opportunityId=' + opportunityId).success(function(response) {

                for(var prop in response){
                    console.log('response prop: ' + prop);
                    console.log('response prop value: ' + response[prop]);
                }
                $scope.selectedOpportunityId = response.CSCOpportunityID;
                $scope.opportunityName = response.OpportunityName;
                $scope.accountName = response.AccountName;
                $scope.solutionExecutiveName = response.SolutionExecutiveName;
                $scope.solutionArchitectName = response.SolutionArchitectName;
                $scope.opportunityOwner = response.OpportunityOwner;
                $scope.noDcInTheDeal = response.NoDcInTheDeal;
                $scope.opportunityIndustry = response.Industry;
                $scope.revenueStartDate = response.RevenueStartDate;

                $scope.industries.forEach(function(industry){
                   if(industry.name === $scope.opportunityIndustry){
                       industry.ticked = true;
                       if(industry.name){
                           $scope.industry = industry.name;
                       }
                       else {
                           $scope.industry = 'unknown / unmatched';
                       }
                   }
                });

                //Get the Dc Vendor mapping for selected Industry:
                $http.get('/dc_vendor_industry_mapping/?industry=' + $scope.opportunityIndustry).success(function(response) {
                    $scope.dcVendor = response;
                });

                console.log('response: ' + response);
                console.log('opportunityName: ' + $scope.opportunityName);
                console.log('accountName: ' + $scope.accountName);
                console.log('Industry: ' + $scope.Industry);

                $scope.selectedOpportunity.push(response);
            });
        };

        function getOpportunityDetails(opportunityId){
            $http.get('/opportunities/?opportunityId=' + opportunityId).success(function(response) {

                for(var prop in response){
                    console.log('response prop: ' + prop);
                    console.log('response prop value: ' + response[prop]);
                }
                    $scope.opportunityName = response.OpportunityName;
                    $scope.accountName = response.AccountName;
                    $scope.solutionExecutiveName = response.SolutionExecutiveName;
                    $scope.solutionArchitectName = response.SolutionArchitectName;
                    $scope.opportunityOwner = response.OpportunityOwner;
                    $scope.noDcInTheDeal = response.NoDcInTheDeal;
                    $scope.opportunityIndustry = response.Industry;

                    $scope.computeCheckboxModel.isProvidingDr = response.IsProvidingDr;
                    $scope.drProvidedFor = response.DrProvidedFor;

                    $scope.industries.forEach(function(industry){
                        if(industry.name === $scope.opportunityIndustry){
                            industry.ticked = true;
                            $scope.industry = industry.name;
                        }
                        //else {
                        //    $scope.industry = 'unknown / unmatched';
                        //}
                    });

                //Get the Dc Vendor mapping for selected Industry:
                $http.get('/dc_vendor_industry_mapping/?industry=' + $scope.opportunityIndustry).success(function(response) {
                    $scope.dcVendor = response;
                });


                console.log('response: ' + response);
                console.log('opportunityName: ' + $scope.opportunityName);
                console.log('accountName: ' + $scope.accountName);

            });
        }

        function getDataCenterDetail(opportunityId, dcName){
            $scope.kwRequired_2016 = '';
            $scope.kwRequired_2017 = '';
            $scope.kwRequired_2018 = '';
            $scope.kwRequired_2019 = '';
            $scope.kwRequired_2020 = '';
            $scope.kwRequired_2021 = '';
            $scope.kwRequired_2022 = '';
            $scope.kwRequired_2023 = '';
            $scope.kwRequired_2024 = '';
            $scope.kwRequired_2025 = '';

            $scope.kwRequired_2016_nq = '';
            $scope.kwRequired_2017_nq = '';
            $scope.kwRequired_2018_nq = '';
            $scope.kwRequired_2019_nq = '';
            $scope.kwRequired_2020_nq = '';
            $scope.kwRequired_2021_nq = '';
            $scope.kwRequired_2022_nq = '';
            $scope.kwRequired_2023_nq = '';
            $scope.kwRequired_2024_nq = '';
            $scope.kwRequired_2025_nq = '';

            $scope.cbRequired_2016 = '';
            $scope.cbRequired_2017 = '';
            $scope.cbRequired_2018 = '';
            $scope.cbRequired_2019 = '';
            $scope.cbRequired_2020 = '';
            $scope.cbRequired_2021 = '';
            $scope.cbRequired_2022 = '';
            $scope.cbRequired_2023 = '';
            $scope.cbRequired_2024 = '';
            $scope.cbRequired_2025 = '';

            $scope.cbRequired_2016_nq = '';
            $scope.cbRequired_2017_nq = '';
            $scope.cbRequired_2018_nq = '';
            $scope.cbRequired_2019_nq = '';
            $scope.cbRequired_2020_nq = '';
            $scope.cbRequired_2021_nq = '';
            $scope.cbRequired_2022_nq = '';
            $scope.cbRequired_2023_nq = '';
            $scope.cbRequired_2024_nq = '';
            $scope.cbRequired_2025_nq = '';

            $scope.dcCountry = '';
            $scope.dcSiteCode = '';
            $scope.dcSku = '';

            $scope.computeCheckboxModel.cloudCompute = false;
            $scope.computeCheckboxModel.bizCloudHc = false;
            $scope.computeCheckboxModel.bizCloud = false;
            $scope.computeCheckboxModel.storageAsAService = false;
            $scope.computeCheckboxModel.mainframe = false;
            $scope.computeCheckboxModel.unixFarm = false;
            $scope.computeCheckboxModel.windowsFarm = false;
            $scope.computeCheckboxModel.as400 = false;
            $scope.computeCheckboxModel.myWorkstyle = false;
            $scope.computeCheckboxModel.cyber = false;
            $scope.computeCheckboxModel.serviceManagement = false;
            $scope.computeCheckboxModel.lan = false;
            $scope.computeCheckboxModel.wan = false;
            $scope.computeCheckboxModel.isProvidingDr = false;

            $scope.computeCheckboxModel.assetAndConfigurationManagement = false;
            $scope.computeCheckboxModel.enterpriseServiceDesk = false;
            $scope.computeCheckboxModel.firewall = false;
            $scope.computeCheckboxModel.clientSiteLocalSupport = false;
            $scope.computeCheckboxModel.loadBalancers = false;
            $scope.computeCheckboxModel.operationalServiceManagement = false;
            $scope.computeCheckboxModel.proxy = false;
            $scope.computeCheckboxModel.remoteManagementServices = false;
            $scope.computeCheckboxModel.dns = false;
            $scope.computeCheckboxModel.serviceIntegrationAndManagement = false;
            $scope.computeCheckboxModel.dataCenterBasedTouchLabor = false;
            $scope.computeCheckboxModel.serviceRequestManagement = false;
            $scope.computeCheckboxModel.agilityPlatform = false;
            $scope.computeCheckboxModel.bigDataAndAnalytics = false;
            $scope.computeCheckboxModel.mobilityAndSocial = false;

            $scope.drProvidedFor = '';

            $http.get('/salesforce_dc_data/?opportunityId=' + opportunityId +'&dcName=' + dcName).success(function(response) {

            if(response === "no-match"){
                console.log('did not get any matching data centers');
                var matchingDcRecord = $scope.dcNames.filter(function (entry) { return entry.name === dcName; });
                console.log('matchingDcRecord[0].country: ' + matchingDcRecord[0].country);
                console.log('matchingDcRecord[0].siteCode: ' + matchingDcRecord[0].siteCode);
                $scope.dcCountry = matchingDcRecord[0].country;
                $scope.dcSiteCode = matchingDcRecord[0].siteCode;
            }
                else {
            $scope.kwRequired_2016 = response.kwFY16;
            $scope.kwRequired_2017 = response.kwFY17;
            $scope.kwRequired_2018 = response.kwFY18;
            $scope.kwRequired_2019 = response.kwFY19;
            $scope.kwRequired_2020 = response.kwFY20;
            $scope.kwRequired_2021 = response.kwFY21;
            $scope.kwRequired_2022 = response.kwFY22;
            $scope.kwRequired_2023 = response.kwFY23;
            $scope.kwRequired_2024 = response.kwFY24;
            $scope.kwRequired_2025 = response.kwFY25;

                $scope.kwRequired_2016_nq = response.kwFY16_nq;
                $scope.kwRequired_2017_nq = response.kwFY17_nq;
                $scope.kwRequired_2018_nq = response.kwFY18_nq;
                $scope.kwRequired_2019_nq = response.kwFY19_nq;
                $scope.kwRequired_2020_nq = response.kwFY20_nq;
                $scope.kwRequired_2021_nq = response.kwFY21_nq;
                $scope.kwRequired_2022_nq = response.kwFY22_nq;
                $scope.kwRequired_2023_nq = response.kwFY23_nq;
                $scope.kwRequired_2024_nq = response.kwFY24_nq;
                $scope.kwRequired_2025_nq = response.kwFY25_nq;

            $scope.cbRequired_2016 = response.cbFY16;
            $scope.cbRequired_2017 = response.cbFY17;
            $scope.cbRequired_2018 = response.cbFY18;
            $scope.cbRequired_2019 = response.cbFY19;
            $scope.cbRequired_2020 = response.cbFY20;
            $scope.cbRequired_2021 = response.cbFY21;
            $scope.cbRequired_2022 = response.cbFY22;
            $scope.cbRequired_2023 = response.cbFY23;
            $scope.cbRequired_2024 = response.cbFY24;
            $scope.cbRequired_2025 = response.cbFY25;

                $scope.cbRequired_2016_nq = response.cbFY16_nq;
                $scope.cbRequired_2017_nq = response.cbFY17_nq;
                $scope.cbRequired_2018_nq = response.cbFY18_nq;
                $scope.cbRequired_2019_nq = response.cbFY19_nq;
                $scope.cbRequired_2020_nq = response.cbFY20_nq;
                $scope.cbRequired_2021_nq = response.cbFY21_nq;
                $scope.cbRequired_2022_nq = response.cbFY22_nq;
                $scope.cbRequired_2023_nq = response.cbFY23_nq;
                $scope.cbRequired_2024_nq = response.cbFY24_nq;
                $scope.cbRequired_2025_nq = response.cbFY25_nq;

            $scope.dcCountry = response.DCCountry;
            $scope.dcSiteCode = response.DCSiteCode;
            $scope.dcSku = response.DCSKU;

               $scope.computeCheckboxModel.cloudCompute = response.cloudCompute;
               $scope.computeCheckboxModel.bizCloudHc = response.bizCloudHc;
               $scope.computeCheckboxModel.bizCloud = response.bizCloud;
               $scope.computeCheckboxModel.storageAsAService = response.storageAsAService;
               $scope.computeCheckboxModel.mainframe = response.mainframe;
               $scope.computeCheckboxModel.unixFarm = response.unixFarm;
               $scope.computeCheckboxModel.windowsFarm = response.windowsFarm;
               $scope.computeCheckboxModel.as400 = response.as400;
               $scope.computeCheckboxModel.myWorkstyle = response.myWorkstyle;
               $scope.computeCheckboxModel.cyber = response.cyber;
               $scope.computeCheckboxModel.serviceManagement = response.serviceManagement;
               $scope.computeCheckboxModel.lan = response.lan;
               $scope.computeCheckboxModel.wan = response.wan;
                $scope.computeCheckboxModel.isProvidingDr = response.IsProvidingDr;
                $scope.drProvidedFor = response.DrProvidedFor;

                $scope.computeCheckboxModel.assetAndConfigurationManagement = response.assetAndConfigurationManagement;
                $scope.computeCheckboxModel.enterpriseServiceDesk = response.enterpriseServiceDesk;
                $scope.computeCheckboxModel.firewall = response.firewall;
                $scope.computeCheckboxModel.clientSiteLocalSupport = response.clientSiteLocalSupport;
                $scope.computeCheckboxModel.loadBalancers = response.loadBalancers;
                $scope.computeCheckboxModel.operationalServiceManagement = response.operationalServiceManagement;
                $scope.computeCheckboxModel.proxy = response.proxy;
                $scope.computeCheckboxModel.remoteManagementServices = response.remoteManagementServices;
                $scope.computeCheckboxModel.dns = response.dns;
                $scope.computeCheckboxModel.serviceIntegrationAndManagement = response.serviceIntegrationAndManagement;
                $scope.computeCheckboxModel.dataCenterBasedTouchLabor = response.dataCenterBasedTouchLabor;
                $scope.computeCheckboxModel.serviceRequestManagement = response.serviceRequestManagement;
                $scope.computeCheckboxModel.agilityPlatform = response.agilityPlatform;
                $scope.computeCheckboxModel.bigDataAndAnalytics = response.bigDataAndAnalytics;
                $scope.computeCheckboxModel.mobilityAndSocial = response.mobilityAndSocial;
            }

            });
        }

        assertIsAdmin();

        getEnvironment();

        initOpportunityIdList();

        initDcList();

        $scope.years = [
            {
                name: "2016"
            },
            {
                name: "2017"
            },
            {
                name: "2018"
            },
            {
                name: "2019"
            },
            {
                name: "2020"
            },
            {
                name: "2021"
            },
            {
                name: "2022"
            },
            {
                name: "2023"
            },
            {
                name: "2024"
            }
        ];

        $scope.dcNames = [];

        $scope.opportunityIds = [];

        $scope.selectedDcName=[{}];

        //$scope.selectedDcName = [{name: "dc", ticked: true}];

        $scope.$watch(function(scope) {return  $scope.selectedDataCenter },
            function(newValue, oldValue) {
                //if(newValue[0]){
                //    console.log('new value:  ' + newValue[0].name);
                //}
                if(newValue){
                if (newValue[0]) {
                    $scope.$parent.selectedName = newValue[0].name;
                    if ($scope.selectedOpportunity) {
                        if ($scope.selectedOpportunity.length > 0) {
                            if ($scope.selectedOpportunity[0].name) {
                                getDataCenterDetail($scope.selectedOpportunity[0].name, newValue[0].name);
                                selectedDc = newValue[0].name;
                            }
                            else {
                                getDataCenterDetail($scope.selectedOpportunityId, newValue[0].name);
                            }
                        }
                    }
                }
            }
            }
        );

        $scope.$watch(function(scope) {return  $scope.selectedOpportunity },
            function(newValue, oldValue) {
                if(newValue){
                    if(newValue[0]){
                        console.log('new opportunity id:  ' + newValue[0].name);
                        getOpportunityDetails(newValue[0].name);
                    }
                }
            }
        );

        $scope.$watch(function(scope) {return  $scope.selectedRegion },
            function(newValue, oldValue) {
                if(newValue){
                    if(newValue[0]){
                        console.log('Selected Region:  ' + newValue[0].name);
                        selectedRegion = newValue[0].name;
                        $http.get('/dc_by_region_by_vendor/?region=' + newValue[0].name +'&vendor=' + $scope.dcVendor).success(function(response) {
                                    response.forEach(function(dcName){
                                        //if($scope.dcList.indexOf(dcName) == -1){
                                        //    $scope.dcList.push({name:dcName});
                                        //}
                                        var result = $.grep($scope.dcList, function(e){ return e.name == dcName; });
                                        if(result.length == 0){
                                            $scope.dcList.push({name:dcName});
                                            console.log('DC Name:  ' + dcName);
                                        }
                                    })
                            })
                        }
                    }
                }
        );

        $scope.selectedYear="";

        function checkIfFormIsValid(){
            if(($scope.selectedDataCenter.length == 1) && ($scope.selectedRegion.length == 1) && ($scope.industry)){
                    selectedDc = $scope.selectedDataCenter[0].name;
                selectedRegion = $scope.selectedRegion[0].name;
                return true;
            }
            else {
                return false;
            }
        }

        $scope.postUpdate = function(){
            var oppId;


            if($scope.selectedOpportunityId !== undefined){
                oppId = $scope.selectedOpportunityId;
            }
            else {
                    oppId = $scope.selectedOpportunity[0].name;
            }

            if(selectedDc === undefined){
                selectedDc = $scope.selectedDataCenter[0].name;
            }

            var postData = {
                opportunityId: oppId,
                opportunityName: $scope.opportunityName,
                accountName: $scope.accountName,
                opportunityOwner: $scope.opportunityOwner,
                solutionExecutiveName: $scope.solutionExecutiveName,
                solutionArchitectName: $scope.solutionArchitectName,
                noDcInTheDeal: $scope.noDcInTheDeal,
                industry: $scope.industry,
                dcName: selectedDc,
                dcRegion: selectedRegion,
                vendor: $scope.dcVendor,
                dcCountry: $scope.dcCountry,
                dcSiteCode: $scope.dcSiteCode,
                dcSku: $scope.dcSku,
                exceptionRequest: $scope.exceptionRequest,
                kwRequired_2016: $scope.kwRequired_2016,
                kwRequired_2017: $scope.kwRequired_2017,
                kwRequired_2018: $scope.kwRequired_2018,
                kwRequired_2019: $scope.kwRequired_2019,
                kwRequired_2020: $scope.kwRequired_2020,
                kwRequired_2021: $scope.kwRequired_2021,
                kwRequired_2022: $scope.kwRequired_2022,
                kwRequired_2023: $scope.kwRequired_2023,
                kwRequired_2024: $scope.kwRequired_2024,
                kwRequired_2025: $scope.kwRequired_2025,

                kwRequired_2016_nq: $scope.kwRequired_2016_nq,
                kwRequired_2017_nq: $scope.kwRequired_2017_nq,
                kwRequired_2018_nq: $scope.kwRequired_2018_nq,
                kwRequired_2019_nq: $scope.kwRequired_2019_nq,
                kwRequired_2020_nq: $scope.kwRequired_2020_nq,
                kwRequired_2021_nq: $scope.kwRequired_2021_nq,
                kwRequired_2022_nq: $scope.kwRequired_2022_nq,
                kwRequired_2023_nq: $scope.kwRequired_2023_nq,
                kwRequired_2024_nq: $scope.kwRequired_2024_nq,
                kwRequired_2025_nq: $scope.kwRequired_2025_nq,

                cbRequired_2016: $scope.cbRequired_2016,
                cbRequired_2017: $scope.cbRequired_2017,
                cbRequired_2018: $scope.cbRequired_2018,
                cbRequired_2019: $scope.cbRequired_2019,
                cbRequired_2020: $scope.cbRequired_2020,
                cbRequired_2021: $scope.cbRequired_2021,
                cbRequired_2022: $scope.cbRequired_2022,
                cbRequired_2023: $scope.cbRequired_2023,
                cbRequired_2024: $scope.cbRequired_2024,
                cbRequired_2025: $scope.cbRequired_2025,

                cbRequired_2016_nq: $scope.cbRequired_2016_nq,
                cbRequired_2017_nq: $scope.cbRequired_2017_nq,
                cbRequired_2018_nq: $scope.cbRequired_2018_nq,
                cbRequired_2019_nq: $scope.cbRequired_2019_nq,
                cbRequired_2020_nq: $scope.cbRequired_2020_nq,
                cbRequired_2021_nq: $scope.cbRequired_2021_nq,
                cbRequired_2022_nq: $scope.cbRequired_2022_nq,
                cbRequired_2023_nq: $scope.cbRequired_2023_nq,
                cbRequired_2024_nq: $scope.cbRequired_2024_nq,
                cbRequired_2025_nq: $scope.cbRequired_2025_nq,

                cloudCompute:   $scope.computeCheckboxModel.cloudCompute,
                bizCloudHc: $scope.computeCheckboxModel.bizCloudHc,
                bizCloud:   $scope.computeCheckboxModel.bizCloud,
                storageAsAService:  $scope.computeCheckboxModel.storageAsAService,
                mainframe:  $scope.computeCheckboxModel.mainframe,
                unixFarm:   $scope.computeCheckboxModel.unixFarm,
                windowsFarm: $scope.computeCheckboxModel.windowsFarm,
                as400:  $scope.computeCheckboxModel.as400,
                myWorkstyle: $scope.computeCheckboxModel.myWorkstyle,
                cyber:  $scope.computeCheckboxModel.cyber,
                serviceManagement: $scope.computeCheckboxModel.serviceManagement,
                lan:    $scope.computeCheckboxModel.lan,
                wan:    $scope.computeCheckboxModel.wan,
                isProvidingDr: $scope.computeCheckboxModel.isProvidingDr,
                drProvidedFor: $scope.drProvidedFor,

                assetAndConfigurationManagement: $scope.computeCheckboxModel.assetAndConfigurationManagement,
                enterpriseServiceDesk: $scope.computeCheckboxModel.enterpriseServiceDesk,
                firewall: $scope.computeCheckboxModel.firewall,
                clientSiteLocalSupport: $scope.computeCheckboxModel.clientSiteLocalSupport,
                loadBalancers: $scope.computeCheckboxModel.loadBalancers,
                operationalServiceManagement: $scope.computeCheckboxModel.operationalServiceManagement,
                proxy: $scope.computeCheckboxModel.proxy,
                remoteManagementServices: $scope.computeCheckboxModel.remoteManagementServices,
                dns: $scope.dns,
                serviceIntegrationAndManagement: $scope.computeCheckboxModel.serviceIntegrationAndManagement,
                dataCenterBasedTouchLabor: $scope.computeCheckboxModel.dataCenterBasedTouchLabor,
                serviceRequestManagement: $scope.computeCheckboxModel.serviceRequestManagement,
                agilityPlatform: $scope.computeCheckboxModel.agilityPlatform,
                bigDataAndAnalytics: $scope.computeCheckboxModel.bigDataAndAnalytics,
                mobilityAndSocial: $scope.computeCheckboxModel.mobilityAndSocial
            };

            var json = angular.toJson(postData);
            var isFormValid;
            isFormValid = checkIfFormIsValid();
            if(isFormValid){
                $http.post('/salesforce_update', json)
                    .then(function(result)
                    {
                        setTimeout(function(){
                            $http.get("/salesforce_quote/?fileName=" + result.data,
                                {headers: { 'Accept': 'application/pdf' },
                                    responseType: 'arraybuffer' })
                                .success(function(data) {
                                    alert('Update Successful');
                                    var file = new Blob([data], {type: 'application/pdf'});
                                    var fileURL = URL.createObjectURL(file);

                                    var newTab = $window.open('about:blank', '_blank');
                                    newTab.document.write("<object width='600' height='400' data='" + fileURL + "' type='"+ 'application/pdf' +"' ></object>");
                                });
                        }, 1000);
                    });
            }
            else {
                var missingFields;
                if(selectedDc == undefined){
                    if(missingFields !== undefined){
                        missingFields = 'Data Center' + ', ' + missingFields;
                    }
                    else {
                        missingFields = 'Data Center';
                    }

                }
                if(selectedRegion == undefined){
                    if(missingFields !== undefined){
                        missingFields = 'Region' + ', ' + missingFields;
                    }
                    else {
                        missingFields = 'Region';
                    }

                }
                alert('Before hitting Submit, you need to fill out the following fields: ' + missingFields);
            }

        };

        $scope.getSalesforceQuote = function(){

            $http.get("/salesforce_quote/?fileName=" + $scope.quote,
            {headers: { 'Accept': 'application/pdf' },
                responseType: 'arraybuffer' })
                .success(function(data) {
                    var file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);

                    var newTab = $window.open('about:blank', '_blank');
                    newTab.document.write("<object width='600' height='400' data='" + fileURL + "' type='"+ 'application/pdf' +"' ></object>");
                });
        };

        var setAllInactive = function() {
            angular.forEach($scope.workspaces, function(workspace) {
                workspace.active = false;
            });
        };

        $scope.activeWorkspaceSheetName = function(){
            $scope.workspaces.forEach(function(workspace) {
                if(workspace.active){
                    return workspace.name;
                }
            });
        };

        var addNewWorkspace = function() {
            var id = $scope.workspaces.length + 1;
            $scope.workspaces.push({
                id: id,
                name:  "dc-" + id,
                active: true
            });
        };

        $scope.workspaces =
            [
                { id: 1, name: "dc1" ,active:true  }
            ];

        $scope.addWorkspace = function () {
            setAllInactive();
            addNewWorkspace();
        };

        $scope.removeWorkspace = function() {
            angular.forEach($scope.workspaces, function(workspace) {
                if(workspace.active){
                    var index = $scope.workspaces.indexOf(workspace);
                    console.log('Active Workspace id: ' + index);
                    $scope.workspaces.splice(index,1);
                }
            });
        };


    }
]);
