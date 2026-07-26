import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plant = searchParams.get('plant') || 'M001';
  const horizon = parseInt(searchParams.get('horizon') || '6', 10);

  const metrics = [
    {
      model: "ARIMA",
      mae: plant === 'M001' ? 25235.35 : 31240.10,
      rmse: plant === 'M001' ? 37285.67 : 42100.50,
      mape: 18.45,
      r2_score: 0.8842
    },
    {
      model: "Prophet",
      mae: plant === 'M001' ? 28410.20 : 34150.00,
      rmse: plant === 'M001' ? 39800.00 : 45200.00,
      mape: 21.30,
      r2_score: 0.8210
    },
    {
      model: "XGBoost",
      mae: plant === 'M001' ? 26150.00 : 32900.00,
      rmse: plant === 'M001' ? 38100.00 : 43800.00,
      mape: 19.80,
      r2_score: 0.8615
    }
  ];

  return NextResponse.json({
    plant,
    horizon,
    metrics,
    best_model: "ARIMA"
  });
}
