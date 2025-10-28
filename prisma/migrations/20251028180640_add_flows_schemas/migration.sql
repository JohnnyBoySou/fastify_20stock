-- CreateEnum
CREATE TYPE "public"."FlowStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- CreateEnum
CREATE TYPE "public"."FlowNodeType" AS ENUM ('TRIGGER', 'CONDITION', 'ACTION', 'NOTIFICATION');

-- CreateEnum
CREATE TYPE "public"."FlowExecutionStatus" AS ENUM ('SUCCESS', 'FAILED', 'RUNNING', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."flows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "nodes" JSONB NOT NULL,
    "edges" JSONB NOT NULL,
    "status" "public"."FlowStatus" NOT NULL DEFAULT 'DRAFT',
    "storeId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."flow_nodes" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "type" "public"."FlowNodeType" NOT NULL,
    "config" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."flow_executions" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "status" "public"."FlowExecutionStatus" NOT NULL,
    "triggerType" TEXT NOT NULL,
    "triggerData" JSONB NOT NULL,
    "executionLog" JSONB NOT NULL,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,

    CONSTRAINT "flow_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flow_nodes_flowId_nodeId_key" ON "public"."flow_nodes"("flowId", "nodeId");

-- AddForeignKey
ALTER TABLE "public"."flows" ADD CONSTRAINT "flows_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."flows" ADD CONSTRAINT "flows_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."flow_nodes" ADD CONSTRAINT "flow_nodes_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."flow_executions" ADD CONSTRAINT "flow_executions_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
