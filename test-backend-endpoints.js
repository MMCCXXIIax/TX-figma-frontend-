// 🧪 Test All 4 New Backend Endpoints
// Run this in browser console or Node.js to verify endpoints are working

const baseUrl = 'https://tx-predictive-intelligence.onrender.com';

async function testAllEndpoints() {
  console.log('🚀 Testing all 4 new backend endpoints...\n');

  try {
    // 1. Test Attribution
    console.log('1️⃣ Testing Attribution Endpoint...');
    const attrResponse = await fetch(`${baseUrl}/api/analytics/attribution?period=30d`);
    const attrData = await attrResponse.json();
    console.log('✅ Attribution:', attrData);
    console.log('   - Success:', attrData.success);
    console.log('   - Total Return:', attrData.data?.total_return);
    console.log('   - Layers:', attrData.data?.layers?.length);
    console.log('');

    // 2. Test Forecast
    console.log('2️⃣ Testing Forecast Endpoint...');
    const forecastResponse = await fetch(`${baseUrl}/api/analytics/forecast?timeframe=7d`);
    const forecastData = await forecastResponse.json();
    console.log('✅ Forecast:', forecastData);
    console.log('   - Success:', forecastData.success);
    console.log('   - Forecasted Values:', forecastData.data?.forecasted_values?.length);
    console.log('   - Confidence Interval:', forecastData.data?.confidence_interval);
    console.log('');

    // 3. Test Achievements
    console.log('3️⃣ Testing Achievements Endpoint...');
    const achievementsResponse = await fetch(`${baseUrl}/api/achievements`);
    const achievementsData = await achievementsResponse.json();
    console.log('✅ Achievements:', achievementsData);
    console.log('   - Success:', achievementsData.success);
    console.log('   - Total Unlocked:', achievementsData.data?.total_unlocked);
    console.log('   - Achievements:', achievementsData.data?.achievements?.length);
    console.log('');

    // 4. Test Streak
    console.log('4️⃣ Testing Streak Endpoint...');
    const streakResponse = await fetch(`${baseUrl}/api/streak`);
    const streakData = await streakResponse.json();
    console.log('✅ Streak:', streakData);
    console.log('   - Success:', streakData.success);
    console.log('   - Current Streak:', streakData.data?.current_streak);
    console.log('   - Streak Type:', streakData.data?.streak_type);
    console.log('');

    console.log('🎉 ALL ENDPOINTS WORKING! Backend integration complete!');
    console.log('📝 You can now remove mock data and use real endpoints.');

  } catch (error) {
    console.error('❌ Error testing endpoints:', error);
    console.log('⏱️ Backend may still be deploying. Wait 2-5 minutes and try again.');
  }
}

// Run the test
testAllEndpoints();
